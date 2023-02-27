import { userServices } from "../service";
import { successHandler, errorHandler } from "../../../utils/responseHandler";
import { asyncHandler } from "../../../utils/asyncHandler";
import { Request, Response } from "express";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { envOptions } from "../../../config/env";
import { parseFile } from "fast-csv";
import fs from "fs";
import { registerationEmail } from "../../../utils/emailTransport";

export class UserRouteHandler {
  static addCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to addCustomer");
      const tempPassword = Math.random().toString(36).slice(-8);
      const [customerErr, customer] = await asyncHandler(
        userServices.createUser(
          {
            is_active: true,
            ...req.body,
          },
        )
      );
      
      if (customerErr) {
        throw new CustomError(customerErr);
      }
      const link = `${envOptions.BASE_URL}`;
      return successHandler(res, { message: "Customer created successfully" });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static listCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listCustomer");
      const [err, usersList] = await asyncHandler(
        userServices.getAllCustomers(req.query)
      );
      if (err) {
        throw new CustomError(err);
      }
      const [{ total_count, paginated_data }] = usersList;
      return successHandler(
        res,
        {
          count: total_count[0]?.count,
          message: "List of students",
          data: paginated_data,
        },
        req.query
      );
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static removeCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to removeCustomer");
      const [err, usersList] = await asyncHandler(
        userServices.deleteCustomer(req.params.student_id)
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!usersList) {
        throw new CustomError({
          message: "Customer doesnt exist",
          statusCode: 404,
        });
      }
      usersList.logo
        ? fs.unlinkSync("files/logo/" + usersList.logo.split("/").pop())
        : null;
      return successHandler(res, { message: "Customer removed successfully" });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static updateCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to updateCustomer");
      const [err, studentDetail] = await asyncHandler(
        userServices.updateCustomer({ _id: req.user.kind && req.user.kind=='Customer'?req.user._id:req.params.student_id }, req.body)
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!studentDetail) {
        throw new CustomError({
          message: "Customer doesnt exist",
          statusCode: 404,
        });
      }
      return successHandler(res, {
        message: "Customer updated successfully",
        data: studentDetail,
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };


  static updateCustomerCart = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to updateCustomerCart");
      const [err, detail] = await asyncHandler(
        userServices.updateCustomer({ _id: req.user._id}, req.body)
      );
      if (err) {
        throw new CustomError(err);
      }

      return successHandler(res, {
        message: "Customer Cart updated successfully",
        data: detail,
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };


  static addAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to add User");
      const tempPassword = Math.random().toString(36).slice(-8);     
      const [adminErr, adminDetails] = await asyncHandler(
        userServices.createUser({
          password: tempPassword,
          ...req.body,
        })
      );
      console.log(tempPassword);
      if (adminErr) {
        throw new CustomError(adminErr);
      }
      return successHandler(res, {
        message: "User added successfully",
        data: adminDetails,
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static listAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listAdmin");
      const [err, roleId] = await asyncHandler(
        userServices.getUserRole("Admin")
      );
      if (err) {
        throw new CustomError(err);
      }
      const [adminErr, adminDetails] = await asyncHandler(
        userServices.getAllUser(req.query, roleId._id)
      );
      if (adminErr) {
        throw new CustomError(adminErr);
      }
      const [{ total_count, paginated_data }] = adminDetails;
      return successHandler(
        res,
        {
          count: total_count[0]?.count,
          message: "List of admins",
          data: paginated_data,
        },
        req.query
      );
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static removeAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to removeAdmin");
      const [adminErr, adminDetails] = await asyncHandler(
        userServices.deleteUser(req.params.admin_id)
      );
      if (adminErr) {
        throw new CustomError(adminErr);
      }
      if (!adminDetails) {
        throw new CustomError({
          message: "Admin doesnt exist",
          statusCode: 404,
        });
      }
      return successHandler(res, { message: "Admin removed successfully" });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static updateAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to updateAdmin");
      const [adminErr, adminDetails] = await asyncHandler(
        userServices.updateUser({ _id: req.params.admin_id }, req.body)
      );
      if (adminErr) {
        throw new CustomError(adminErr);
      }
      if (!adminDetails) {
        throw new CustomError({
          message: "Admin doesnt exist",
          statusCode: 404,
        });
      }
      return successHandler(res, { message: "Admin updated successfully" });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static updateSuperAdmin = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      logger.info("Incoming request to updateSuperAdmin");
      const [adminErr, adminDetails] = await asyncHandler(
        userServices.updateUser({ _id: req.user._id }, req.body)
      );
      if (adminErr) {
        throw new CustomError(adminErr);
      }
      if (!adminDetails) {
        throw new CustomError({
          message: "Super Admin doesnt exist",
          statusCode: 404,
        });
      }
      return successHandler(res, {
        message: "Super Admin updated successfully",
        data: adminDetails,
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static addPermissionToUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      logger.info("Incoming request to addPermissionToUser");
      const { role_id, permission_id } = req.params;
      const [err, permissionDetails] = await asyncHandler(
        userServices.updateRolePermissions(role_id, permission_id)
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!permissionDetails) {
        throw new CustomError({
          message: "Role doesnt exist",
          statusCode: 404,
        });
      }
      return successHandler(res, {
        message: "Added permission to user successfully",
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static listPermissions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      logger.info("Incoming request to listPermissions");
      const [err, permissionDetails] = await asyncHandler(
        userServices.getAllPermission()
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, {
        message: "List all permissions successfully",
        data: permissionDetails,
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static listPermissionForRole = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      logger.info("Incoming request to listPermissionForRole");
      const [err, permissionDetails] = await asyncHandler(
        userServices.getPermission()
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, {
        message: "List all permissions under each roles",
        data: permissionDetails,
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static listRoleForPermission = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      logger.info("Incoming request to listRolesForPermission");
      const [err, permissionDetails] = await asyncHandler(
        userServices.getRoleForPermission()
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, {
        message: "List all roles under each permissions",
        data: permissionDetails,
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };
}
