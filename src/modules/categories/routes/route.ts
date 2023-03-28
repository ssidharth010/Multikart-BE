import express from "express";
import { IRouter } from "../../../config/interface";
import { checkSchema } from "express-validator";
import {
  addCategoriesValidation, deleteCategoriesValidation, listCategoriesValidation, updateCategoriesValidation
} from "../middlewares/fieldValidation";
import { validate } from "../../../utils/validate";
import { CategoriesRouteHandler } from "./routeHandler";
import { authorization } from "../../../utils/authorization";
import { upload } from "../../../utils/uploadFile";
import { authorizeAdmin } from "../../../utils/authorizeAdmin";

class CategoriesRouter implements IRouter {
  public publicRouter;
  public privateRouter;

  constructor() {
    this.publicRouter = express.Router();
    this.privateRouter = express.Router();
    this.getRoutes();
  }

  getRoutes() {
    this.privateRouter.post(
      "/add",
      upload(["jpg", "png", "jpeg"], "single",[{name: "image", maxCount:1}],"files/categories"),
      checkSchema(addCategoriesValidation),
      validate(Object.keys(addCategoriesValidation)),
      CategoriesRouteHandler.addCategories
    );

     this.publicRouter.get(
      "/list",
      // checkSchema(listCategoriesValidation),
      // validate(Object.keys(listCategoriesValidation)),
      CategoriesRouteHandler.listCategories
    );

    this.publicRouter.get(
      "/:id",
      CategoriesRouteHandler.listProductById
    );

     this.privateRouter.put(
      "/update/:categories_id",
      authorizeAdmin(),
      upload(["jpg", "png", "jpeg"], "single",[{name: "image_path", maxCount:1}],"files/categories"),
      checkSchema(updateCategoriesValidation),
      validate(Object.keys(updateCategoriesValidation)),
      CategoriesRouteHandler.updateCategories
    );

     this.privateRouter.delete(
      "/remove/:categories_id",
      authorizeAdmin(),
      CategoriesRouteHandler.removeCategories
    );
  }
}

export const categoriesRouter = new CategoriesRouter();
