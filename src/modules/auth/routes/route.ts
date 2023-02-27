import express from "express";
import { IRouter } from "../../../config/interface";
import { checkSchema } from "express-validator";
import {
  loginValidation,
  forgotPasswordValidation,
  changePasswordValidation,
} from "../middlewares/fieldValidation";
import { validate } from "../../../utils/validate";
import { AuthRouteHandler } from "./routeHandler";

class AuthRouter implements IRouter {
  public publicRouter;
  public privateRouter;

  constructor() {
    this.publicRouter = express.Router();
    this.privateRouter = express.Router();
    this.getRoutes();
  }

  getRoutes() {
    this.publicRouter.post(
      "/login",
      checkSchema(loginValidation),
      validate(Object.keys(loginValidation)),
      AuthRouteHandler.login
    );

    this.publicRouter.post(
      "/password/forgot",
      checkSchema(forgotPasswordValidation),
      validate(Object.keys(forgotPasswordValidation)),
      AuthRouteHandler.forgotPassword
    );

    this.privateRouter.post(
      "/password/change",
      checkSchema(changePasswordValidation),
      validate(Object.keys(changePasswordValidation)),
      AuthRouteHandler.changePassword
    );

    this.privateRouter.post("/logout", AuthRouteHandler.logout);
  }
}

export const authRouter = new AuthRouter();
