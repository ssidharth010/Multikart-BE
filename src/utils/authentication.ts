import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envOptions } from "../config/env";
import { CustomError } from "./customError";
import { authServices } from "../modules/auth/service";
import { asyncHandler } from "./asyncHandler";

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      throw new CustomError({
        message: "Please pass in the auth token",
        statusCode: 401,
      });
    }
    if (token?.startsWith("Technaunce")) {
      token = token.split(" ")[1];
      const decode: any = jwt.verify(
        token,
        envOptions.JWT_SECRET_KEY,
        { audience: `${envOptions.BASE_URL}`, issuer: `${envOptions.API_URL}` },
        (err, user) => {
          if (err) {
            throw new CustomError({
              message: "Invalid auth token",
              statusCode: 401,
            });
          }
          return user;
        }
      );
      const [err, userResponse] = await asyncHandler(
        authServices.getUserPermissions({ _id: decode?.id })
      );
      if (err) {
        throw new CustomError(err);
      }
      // if(userResponse.token != token) {
      //   throw new CustomError({
      //     message: "Token expired",
      //     statusCode: 401,
      //   });
      // }
      req.user = userResponse;
      next();
    } else {
      throw new CustomError({
        message: "Please pass in the auth token in required format",
        statusCode: 401,
      });
    }
  } catch (err) {
    next(err);
  }
};
