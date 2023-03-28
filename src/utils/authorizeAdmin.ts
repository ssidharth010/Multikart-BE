import { Request, Response, NextFunction } from "express";
import { CustomError } from "./customError";

export const authorizeAdmin =
  () =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user?.admin;
      if (admin) {
        next();
      } else {
        throw new CustomError({
          message: "Unauthorized role",
          statusCode: 403,
        });
      }
    } catch (err) {
      next(err);
    }
  };
