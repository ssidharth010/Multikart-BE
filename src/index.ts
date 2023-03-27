import { collection } from "./config/dbCollection";
import { Server } from "./app";
import logger from "./utils/logger";
import { envOptions } from "./config/env";
import { userServices } from "./modules/user/service";
import { asyncHandler } from "./utils/asyncHandler";
import { CustomError } from "./utils/customError";

class Init {
  static async setup() {
    await collection.init();
    const [adminErr, admin] = await asyncHandler(
      userServices.createUser(
        {first_name: 'Admin', last_name: 'Admin', email: envOptions.ADMIN_EMAIL, admin:true, password: envOptions.ADMIN_PASS,is_active: true}
      )
    );
    if (admin) { 
      logger.info(`Admin created`)
    }
    if (adminErr) {
      throw new CustomError(adminErr);
    }

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
