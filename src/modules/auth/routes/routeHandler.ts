import { authServices } from "../service";
import { successHandler, errorHandler } from "../../../utils/responseHandler";
import { asyncHandler } from "../../../utils/asyncHandler";
import { Request, Response } from "express";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import bcrypt from "bcrypt";
import { generateToken } from "../middlewares/generateToken";
import { resetPasswordEmail } from "../../../utils/emailTransport";
import { envOptions } from "../../../config/env";

export class AuthRouteHandler {

  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to login");
      const { email = req.query.email, password } = req.body;
      const [err, userResponse] = await asyncHandler(
        authServices.getUserByField({ email })
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!userResponse.length) {
        throw new CustomError({
          message: "User not registered. Please contact the admin",
          statusCode: 404,
        });
      }
      const { _id, password: userPassword } = userResponse[0];
      if (await bcrypt.compare(password, userPassword)) {
        const token = generateToken(_id);
        const [err, updateResponse] = await asyncHandler(
          authServices.updateUserField({ email }, { token })
        );
        if (err) {
          throw new CustomError(err);
        }
        const [userErr, userPermission] = await asyncHandler(
          authServices.getUserPermissions({ email })
        );
        if (userErr) {
          throw new CustomError(userErr);
        }
        return successHandler(res, {
          message: "User logged in successfully",
          data: userPermission,
        });
      } else {
        throw new CustomError({
          message: "Password is incorrect",
          statusCode: 400,
        });
      }
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      logger.info("Incoming request to forgotPassword");
      const { email } = req.body;
      const [err, userResponse] = await asyncHandler(
        authServices.getUserByField({ email })
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!userResponse.length) {
        throw new CustomError({
          message: "User not registered. Please contact the admin",
          statusCode: 404,
        });
      }
      const link = `${envOptions.BASE_URL}`;
      const tempPassword = Math.random().toString(36).slice(-8);
      const [userErr, userDetail] = await asyncHandler(
        authServices.updateUserField({ email }, { password: tempPassword })
      );
      if (userErr) {
        throw new CustomError(err);
      }
      await resetPasswordEmail(email, link, tempPassword);
      return successHandler(res, {
        message: "Email has been sent for password reset",
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static changePassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      logger.info("Incoming request to changePassword");
      const { old_password, new_password, confirm_password } = req.body;
      const { email } = req.user;
      const [userErr, userPassword] = await asyncHandler(
        authServices.getUserPermissions({ email },{password:true})
      );
      if (userErr) {
        throw new CustomError(userErr);
      }
      const {password} = userPassword
      if (!(await bcrypt.compare(old_password, password))) {
        throw new CustomError({
          message: "Current password is incorrect",
          statusCode: 400,
        });
      }
      if (old_password == new_password) {
        throw new CustomError({
          message: "Old and new password cannot be same",
          statusCode: 400,
        });
      }
      if (new_password != confirm_password) {
        throw new CustomError({
          message: "Password and confirmed password doesnt match",
          statusCode: 400,
        });
      }
      const [err, userResponse] = await asyncHandler(
        authServices.updateUserField({ email }, { password: new_password })
      );
      if (err) {
        throw new CustomError(err);
      }
      return res.redirect(307, `${envOptions.API_URL}/v1/auth/logout`);
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static logout = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to logout");
      const { email } = req.user;
      const [err, userResponse] = await asyncHandler(
        authServices.updateUserField({ email }, { token: null })
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, { message: "User successfully  logged out" });
    } catch (err) {
      return errorHandler(res, err);
    }
  };
}
