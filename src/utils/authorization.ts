import { Request, Response, NextFunction } from "express";
import { CustomError } from "./customError";

export const authorization =
  (permissions: Array<string>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;
      const userPermissions = userRole.permission.map(
        (e: Record<string, unknown>) => e.name
      );
      if (permissions.every((e) => userPermissions.includes(e))) {
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
