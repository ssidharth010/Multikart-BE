import { collection } from "./config/dbCollection";
import { Server } from "./app";
import logger from "./utils/logger";
import { envOptions } from "./config/env";

class Init {
  static async setup() {
    await collection.init();
    const server = new Server().setHeaders().setMiddlewares();
    server.app
      .listen(envOptions.PORT, () => {
        logger.info(`Successfully connected to port ${envOptions.PORT}`);
      })
      .on("error", (err) => {
        logger.error(err.stack);
        process.exitCode = 1;
      });
  }
}

Init.setup();
