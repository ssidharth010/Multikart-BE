import { Db1 } from "./db1";
import mongoose from "mongoose";
import logger from "../utils/logger";
import { IDbCollection } from "./interface";

class DbCollection implements IDbCollection {
  public db1Inst;

  constructor(Db1: any) {
    this.db1Inst = new Db1(mongoose);
  }

  async init() {
    await (await this.db1Inst.connect()).importModels();
    logger.info("All models synced");
    return this;
  }
}

export const collection = new DbCollection(Db1);
