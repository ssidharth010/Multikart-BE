import Db from "./interface";
import { db1ModelImports } from "./db1.imports";
import logger from "../utils/logger";
import { envOptions } from "./env";

export class Db1 extends Db {
  constructor(orm: any) {
    super(orm);
  }

  async connect() {
    try {
      this.options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
      this.instance = await this.orm.createConnection(
        envOptions.MONGODB_URL,
        this.options
      );
      logger.info("Connected to db1");
      return this;
    } catch (err) {
      logger.error(err);
    }
  }

  importModels() {
    db1ModelImports.forEach((model: any) =>
      model.setup(this.orm, this.instance)
    );
    logger.info("Import models from db1");
    return this;
  }
}
