import express from "express";
import { IRouter } from "../../../config/interface";
import { checkSchema } from "express-validator";
import {
  addProductsValidation, deleteProductsValidation, listProductsValidation, updateProductsValidation
} from "../middlewares/fieldValidation";
import { validate } from "../../../utils/validate";
import { ProductsRouteHandler } from "./routeHandler";
import { authorization } from "../../../utils/authorization";
import { upload } from "../../../utils/uploadFile";
import { authorizeAdmin } from "../../../utils/authorizeAdmin";

class ProductsRouter implements IRouter {
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
      upload(["jpg", "png", "jpeg"], "array",[{name: "image", maxCount:3}],"files/products"),
      checkSchema(addProductsValidation),
      validate(Object.keys(addProductsValidation)),
      ProductsRouteHandler.addProducts
    );

     this.publicRouter.get(
      "/list",
      // checkSchema(listProductsValidation),
      // validate(Object.keys(listProductsValidation)),
      ProductsRouteHandler.listProducts
    );

    this.publicRouter.get(
      "/:id",
      ProductsRouteHandler.listProductById
    );

     this.privateRouter.put(
      "/update/:products_id",
      authorizeAdmin(),
      upload(["jpg", "png", "jpeg"], "array",[{name: "image", maxCount:3}],"files/products"),
      // checkSchema(updateProductsValidation),
      // validate(Object.keys(updateProductsValidation)),
      ProductsRouteHandler.updateProducts
    );

     this.privateRouter.delete(
      "/remove/:products_id",
      authorizeAdmin(),
      checkSchema(deleteProductsValidation),
      validate(Object.keys(deleteProductsValidation)),
      ProductsRouteHandler.removeProducts
    );
  }
}

export const productsRouter = new ProductsRouter();
