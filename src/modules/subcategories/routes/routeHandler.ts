import { subcategoriesServices } from "../service";
import { successHandler, errorHandler } from "../../../utils/responseHandler";
import { asyncHandler } from "../../../utils/asyncHandler";
import { Request, Response } from "express";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import fs from "fs"
import { envOptions } from "../../../config/env";

export class SubCategoriesRouteHandler {

  static addSubCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to addSubCategories");
      const { name, category_id } = req.body;
      const [err, subcategoriesResponse] = await asyncHandler(
        subcategoriesServices.createSubCategories(
          {
            name,
            category_id
          }
        )
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, { message: "SubCategories added successfully", data: subcategoriesResponse });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static listSubCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listSubCategories");
      const [err, subcategoriesResponse] = await asyncHandler(
        subcategoriesServices.getAllSubCategories(req.query)
      );
      if (err) {
        throw new CustomError(err);
      }
      const [{ total_count, paginated_data }] = subcategoriesResponse;
      return successHandler(
        res,
        {
          count: total_count[0]?.count,
          message: "List all subcategories successfully",
          data: paginated_data,
        },
        req.query
      );
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static getSubCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listSubCategories");
      const [err, productResponse] = await asyncHandler(
        subcategoriesServices.getSubCategoryById(req.params.id)
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, { message: "List all subcategories successfully", data: productResponse });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static getSubCategoryByCategoryId = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listSubCategories");
      const [err, productResponse] = await asyncHandler(
        subcategoriesServices.getSubCategoryByCategoryId(req.params.category_id)
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, { message: "List all subcategories successfully", data: productResponse });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static updateSubCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to updateSubCategories");
      const { name, category_id } = req.body;
      const { subcategory_id } = req.params
      const [err, subcategoriesResponse] = await asyncHandler(
        subcategoriesServices.editSubCategories(subcategory_id,
          {
            name, category_id 
          })
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!subcategoriesResponse) {
        throw new CustomError({
          message: "SubCategories does not exist",
          statusCode: 404,
        });
      }
      return successHandler(res, { message: "SubCategories updated successfully", data: subcategoriesResponse });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static removeSubCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to removeSubCategories");
      const { subcategory_id } = req.params;
      const [err, subcategoriesResponse] = await asyncHandler(
        subcategoriesServices.deleteSubCategories(subcategory_id)
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!subcategoriesResponse) {
        throw new CustomError({
          message: "SubCategories does not exist",
          statusCode: 404,
        });
      }
      return successHandler(res, { message: "SubCategories removed successfully", data: subcategoriesResponse });
    } catch (err) {
      return errorHandler(res, err);
    }
  };
}
