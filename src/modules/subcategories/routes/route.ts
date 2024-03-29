import express from "express";
import { IRouter } from "../../../config/interface";
import { checkSchema } from "express-validator";
import {
  addSubCategoriesValidation, deleteSubCategoriesValidation, listSubCategoriesValidation, updateSubCategoriesValidation
} from "../middlewares/fieldValidation";
import { validate } from "../../../utils/validate";
import { SubCategoriesRouteHandler } from "./routeHandler";
import { authorization } from "../../../utils/authorization";
import { authorizeAdmin } from "../../../utils/authorizeAdmin";

class SubCategoriesRouter implements IRouter {
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
      authorizeAdmin(),
      checkSchema(addSubCategoriesValidation),
      validate(Object.keys(addSubCategoriesValidation)),
      SubCategoriesRouteHandler.addSubCategories
    );

     this.publicRouter.get(
      "/list",
      checkSchema(listSubCategoriesValidation),
      SubCategoriesRouteHandler.listSubCategories
    );

    this.publicRouter.get(
      "/:id",
      SubCategoriesRouteHandler.getSubCategoryById
    );

    this.publicRouter.get(
      "/list/:category_id",
      SubCategoriesRouteHandler.getSubCategoryByCategoryId
    );

     this.privateRouter.put(
      "/update/:subcategory_id",
      authorizeAdmin(),
      checkSchema(updateSubCategoriesValidation),
      validate(Object.keys(updateSubCategoriesValidation)),
      SubCategoriesRouteHandler.updateSubCategories
    );

     this.privateRouter.delete(
      "/remove/:subcategory_id",
      authorizeAdmin(),
      SubCategoriesRouteHandler.removeSubCategories
    );
  }
}

export const subcategoriesRouter = new SubCategoriesRouter();
