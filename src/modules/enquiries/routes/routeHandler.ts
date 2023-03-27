import { enquiriesServices } from "../service";
import { successHandler, errorHandler } from "../../../utils/responseHandler";
import { asyncHandler } from "../../../utils/asyncHandler";
import { Request, Response } from "express";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import fs from "fs"
import { envOptions } from "../../../config/env";

export class EnquiriesRouteHandler {

  static addEnquiries = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to addEnquiries");
      const [err, enquiriesResponse] = await asyncHandler(
        enquiriesServices.createEnquiries(req.body)
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, { message: "Enquiries added successfully", data: enquiriesResponse });
    } catch (err) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return errorHandler(res, err);
    }
  };

  static deleteEnquiry = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to deleteEnquiry");
      const [err, enquiriesResponse] = await asyncHandler(
        enquiriesServices.deleteEnquiry(req.query.id)
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, { message: "Enquiry deleted successfully", data: enquiriesResponse });
    } catch (err) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return errorHandler(res, err);
    }
  };

  static listEnquiries = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listEnquiries");
      const [err, enquiriesResponse] = await asyncHandler(
        enquiriesServices.getAllEnquiries(req.query)
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, { message: "List all enquiries successfully", data: enquiriesResponse });
    } catch (err) {
      return errorHandler(res, err);
    }
  };
}
