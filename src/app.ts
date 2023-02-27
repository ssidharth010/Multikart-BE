import express, { NextFunction,Request, Response } from "express";
import { envOptions } from "./config/env";
import helmet from "helmet";
import cors from "cors";
import { endpoints } from "./config/endpoints";
import { errorHandler } from "./utils/responseHandler";
import { authentication } from "./utils/authentication";
import * as swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { CustomError } from "./utils/customError";
import compression from "compression";
import path from "path";
export class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(express.static('files'));
  }

  setHeaders() {
    const cspDefaults = helmet.contentSecurityPolicy.getDefaultDirectives();
    if (envOptions.ENV == "dev") {
      delete cspDefaults["upgrade-insecure-requests"];
    }
    this.app.use(helmet.dnsPrefetchControl());
    this.app.use(helmet.expectCt());
    this.app.use(helmet.frameguard());
    this.app.use(helmet.hidePoweredBy());
    this.app.use(helmet.ieNoOpen());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.permittedCrossDomainPolicies());
    this.app.use(helmet.referrerPolicy());
    this.app.use(helmet.xssFilter());
    this.app.use(
      helmet({
        originAgentCluster: true,
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginOpenerPolicy: true,
        crossOriginEmbedderPolicy: true,
        contentSecurityPolicy: { directives: cspDefaults },
      })
    );
    return this;
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(compression());

    //cors setup
    const whitelist = envOptions.WHITELIST_SERVER;
    const corsOptions: cors.CorsOptions = {
      origin: (origin, cb) => {
        if (
          origin === undefined ||
          whitelist.indexOf(origin as string) !== -1
        ) {
          cb(null, true);
        } else {
          cb(
            new CustomError({ message: "Not allowed by CORS", statusCode: 403 })
          );
        }
      },
    };

    this.app.use(cors(corsOptions));

    //swagger doc setup
    const options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Express API",
          version: "1.0.0",
        },
      },
      // Paths to files containing OpenAPI definitions
      apis: [
        "./src/modules/auth/routes/route.ts",
        "./src/modules/user/routes/route.ts",
      ],
    };

    const swaggerSpec = swaggerJSDoc(options);
    if (envOptions.ENV == "dev") {
      this.app.use(
        "/technaunce/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec)
      );
    }

    // endpoints and middlewares
    endpoints.forEach((endpoint) => {
      this.app.use(endpoint.path, endpoint.publicRoute);
      this.app.use(endpoint.path, authentication, endpoint.privateRoute);
    });

    //error handler middleware
    this.app.use(function (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      if (err) {
        errorHandler(res, err);
      }
    });

    return this;
  }
}
