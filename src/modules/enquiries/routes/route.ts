import express from "express";
import { IRouter } from "../../../config/interface";
import { checkSchema } from "express-validator";
import {
  addEnquiriesValidation, listEnquiriesValidation
} from "../middlewares/fieldValidation";
import { validate } from "../../../utils/validate";
import { EnquiriesRouteHandler } from "./routeHandler";
import { authorization } from "../../../utils/authorization";
import { upload } from "../../../utils/uploadFile";

class EnquiriesRouter implements IRouter {
  public publicRouter;
  public privateRouter;

  constructor() {
    this.publicRouter = express.Router();
    this.privateRouter = express.Router();
    this.getRoutes();
  }

  getRoutes() {
    this.publicRouter.post(
      "/add",
      checkSchema(addEnquiriesValidation),
      validate(Object.keys(addEnquiriesValidation)),
      EnquiriesRouteHandler.addEnquiries
    );

     this.publicRouter.get(
      "/list",
      checkSchema(listEnquiriesValidation),
      validate(Object.keys(listEnquiriesValidation)),
      EnquiriesRouteHandler.listEnquiries
    );
  }
}

export const enquiriesRouter = new EnquiriesRouter();
