import { productsServices } from "../service";
import { successHandler, errorHandler } from "../../../utils/responseHandler";
import { asyncHandler } from "../../../utils/asyncHandler";
import { Request, Response } from "express";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import fs from "fs"
import { envOptions } from "../../../config/env";

export class ProductsRouteHandler {

  static addProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to addProducts");
      if (!req.files) {
        throw new CustomError({
          message: "Please upload file",
          statusCode: 400,
        });
      }
      const { title, description, price, details, category, subcategory_id, more } = req.body;
      const imageLocations =
        req.files && Array.isArray(req.files)
          ? req.files.map(
            (e) => envOptions.API_URL + "/products/" + e.filename
          )
          : [];
            console.log(more)
      const [err, productsResponse] = await asyncHandler(
        productsServices.createProducts(
          {
            title, description, price, details: JSON.parse(details), category, subcategory_id, more: JSON.parse(more),
            images: imageLocations
          }
        )
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, { message: "Products added successfully", data: productsResponse });
    } catch (err) {
      if (req.file) {
        if (req.files && Array.isArray(req.files) && req.files.length) {
          req.files.forEach((e) => fs.unlinkSync(e.path));
        }
      }
      return errorHandler(res, err);
    }
  };

  static listProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listProducts");
      const { category, maxPrice, minPrice, search } = req.query
      let conditionBody:Record<string,unknown> = {}
      if(search) {
        conditionBody = {title:{$regex: `^${search}.*`, $options:'i'}}
      }
      if(category) {
        conditionBody = {category:{$regex: `^${category}.*`, $options:'i'}}
      }
      if(maxPrice && minPrice) {
        conditionBody = {...conditionBody, price:{$gte: Number(minPrice), $lt: Number(maxPrice)}}
      }
      const [err, productsResponse] = await asyncHandler(
        productsServices.getAllProducts(req.query, conditionBody)
      );
      if (err) {
        throw new CustomError(err);
      }
      
      const [{ total_count, paginated_data }] = productsResponse;
      return successHandler(
        res,
        {
          count: total_count[0]?.count,
          message: "List all products successfully",
          data: paginated_data,
        },
        req.query
      );
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static listProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listProducts");
      const [err, productResponse] = await asyncHandler(
        productsServices.getProductById(req.params.id)
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, { message: "List all products successfully", data: productResponse });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static updateProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to updateProducts");
      const { title, description, image, start_date, end_date } = req.body;
      if (!image && !req.file) {
        throw new CustomError({
          message: "Please upload file",
          statusCode: 400,
        });
      }
      const { products_id } = req.params
      const [err, productsResponse] = await asyncHandler(
        productsServices.editProducts(products_id,
          {
            title, description, posted_by: req.user._id, posted_date: new Date(), start_date, end_date,
            image: req.file ? envOptions.API_URL + "/products/images/" + req.file.filename : image
          })
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!productsResponse) {
        throw new CustomError({
          message: "Products doesnt exist",
          statusCode: 404,
        });
      }
      if (req.file) {
        fs.unlinkSync("files/products/" + image.split('/').pop())
      }
      return successHandler(res, { message: "Products updated successfully", data: productsResponse });
    } catch (err) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return errorHandler(res, err);
    }
  };

  static removeProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to removeProducts");
      const { products_id } = req.params;
      const [err, productsResponse] = await asyncHandler(
        productsServices.deleteProducts(products_id)
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!productsResponse) {
        throw new CustomError({
          message: "Products doesnt exist",
          statusCode: 404,
        });
      }
      fs.unlinkSync("files/products/" + productsResponse.image.split('/').pop())
      return successHandler(res, { message: "Products removed successfully", data: productsResponse });
    } catch (err) {
      return errorHandler(res, err);
    }
  };
}
