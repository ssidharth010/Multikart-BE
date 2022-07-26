import { categoriesServices } from "../service";
import { successHandler, errorHandler } from "../../../utils/responseHandler";
import { asyncHandler } from "../../../utils/asyncHandler";
import { Request, Response } from "express";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import fs from "fs"
import { envOptions } from "../../../config/env";

export class CategoriesRouteHandler {

  static addCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to addCategories");
      if (!req.file) {
        throw new CustomError({
          message: "Please upload file",
          statusCode: 400,
        });
      }
      const { name } = req.body;
      const imageLocation = envOptions.API_URL + "/categories/" + req.file?.filename
      const [err, categoriesResponse] = await asyncHandler(
        categoriesServices.createCategories(
          {
            name,
            image: imageLocation
          }
        )
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, { message: "Categories added successfully", data: categoriesResponse });
    } catch (err) {
      if (req.file) {
        if (req.files && Array.isArray(req.files) && req.files.length) {
          req.files.forEach((e) => fs.unlinkSync(e.path));
        }
      }
      return errorHandler(res, err);
    }
  };

  static listCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listCategories");
      const [err, categoriesResponse] = await asyncHandler(
        categoriesServices.getAllCategories(req.query)
      );
      if (err) {
        throw new CustomError(err);
      }
      const [{ total_count, paginated_data }] = categoriesResponse;
      return successHandler(
        res,
        {
          count: total_count[0]?.count,
          message: "List all categories successfully",
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
      logger.info("Incoming request to listCategories");
      const [err, productResponse] = await asyncHandler(
        categoriesServices.getProductById(req.params.id)
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, { message: "List all categories successfully", data: productResponse });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static updateCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to updateCategories");
      const { title, description, image, start_date, end_date } = req.body;
      if (!image && !req.file) {
        throw new CustomError({
          message: "Please upload file",
          statusCode: 400,
        });
      }
      const { categories_id } = req.params
      const [err, categoriesResponse] = await asyncHandler(
        categoriesServices.editCategories(categories_id,
          {
            title, description, posted_by: req.user._id, posted_date: new Date(), start_date, end_date,
            image: req.file ? envOptions.API_URL + "/categories/images/" + req.file.filename : image
          })
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!categoriesResponse) {
        throw new CustomError({
          message: "Categories doesnt exist",
          statusCode: 404,
        });
      }
      if (req.file) {
        fs.unlinkSync("files/categories/" + image.split('/').pop())
      }
      return successHandler(res, { message: "Categories updated successfully", data: categoriesResponse });
    } catch (err) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return errorHandler(res, err);
    }
  };

  static removeCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to removeCategories");
      const { categories_id } = req.params;
      const [err, categoriesResponse] = await asyncHandler(
        categoriesServices.deleteCategories(categories_id)
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!categoriesResponse) {
        throw new CustomError({
          message: "Categories doesnt exist",
          statusCode: 404,
        });
      }
      fs.unlinkSync("files/categories/" + categoriesResponse.image.split('/').pop())
      return successHandler(res, { message: "Categories removed successfully", data: categoriesResponse });
    } catch (err) {
      return errorHandler(res, err);
    }
  };
}
