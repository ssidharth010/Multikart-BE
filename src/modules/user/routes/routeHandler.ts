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
  static addStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to addStudent");
      const {group_id,...others} = req.body
      const [err, roleId] = await asyncHandler(
        userServices.getUserRole("Student")
      );
      if (err) {
        throw new CustomError(err);
      }
      const tempPassword = Math.random().toString(36).slice(-8);
      const [studentErr, student] = await asyncHandler(
        userServices.createStudent([
          {
            password: tempPassword,
            ...others,
          },
        ])
      );
      if (studentErr) {
        throw new CustomError(studentErr);
      }
      const link = `${envOptions.BASE_URL}`;
      await registerationEmail(
        student.email,
        link,
        tempPassword
      );
      return successHandler(res, { message: "Student created successfully" });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static addBulkStudent = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      logger.info("Incoming request to addBulkStudent");
      let data: Array<Record<string, unknown>> = [];
      const link = `${envOptions.BASE_URL}`;
      if (req.file?.mimetype.split("/")[1] == "csv") {
        parseFile(req.file.path, { headers: true })
          .transform(
            ({
              amount,
              equipments,
              is_active,
              items,
              password,
              services,
              token,
              studentID,
              group_id,
              ...others
            }: any) => ({
              amount: JSON.parse(amount),
              equipments: JSON.parse(equipments),
              is_active: JSON.parse(is_active),
              items: JSON.parse(items),
              password: JSON.parse(password),
              services: JSON.parse(services),
              token: JSON.parse(token),
              studentID: JSON.parse(studentID),
              group_id: group_id == "null" ? JSON.parse(group_id) : group_id,
              ...others,
            })
          )
          .on("error", (error) => {
            fs.unlinkSync(`${req.file?.path}`);
            throw new CustomError(error);
          })
          .on("data", (row) => {
            const tempPassword = Math.random().toString(36).slice(-8);
            data.push({ password: tempPassword, ...row });
          })
          .on("end", async () => {
            try {
              const [studentErr, student] = await asyncHandler(
                userServices.createStudent(data)
              );
              if (studentErr) {
                throw new CustomError(studentErr);
              }
              for (const row of data) {
                const { email, password }: any = row;
                await registerationEmail(email, link, password);
              }
              fs.unlinkSync(`${req.file?.path}`);
              return successHandler(res, {
                message: "Bulk Students added successfully",
              });
            } catch (err) {
              fs.unlinkSync(`${req.file?.path}`);
              return errorHandler(res, err);
            }
          });
      } else {
        data = JSON.parse(fs.readFileSync(`${req.file?.path}`, "utf-8"));
        const newData = data.map(
          ({ role, group_id = null, ...others }: any) => {
            const tempPassword = Math.random().toString(36).slice(-8);
            return {
              role: role["$oid"],
              password: tempPassword,
              group_id: group_id["$oid"] ?? null,
              ...others,
            };
          }
        );
        const [studentErr, student] = await asyncHandler(
          userServices.createStudent(newData)
        );
        if (studentErr) {
          throw new CustomError(studentErr);
        }
        for (const row of newData) {
          await registerationEmail(row.email, link, row.password);
        }
        fs.unlinkSync(`${req.file?.path}`);
        return successHandler(res, {
          message: "Bulk Students added successfully",
        });
      }
    } catch (err) {
      fs.unlinkSync(`${req.file?.path}`);
      return errorHandler(res, err);
    }
  };

  static listStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listStudent");
      const [err, usersList] = await asyncHandler(
        userServices.getAllStudents(req.query)
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

  static removeStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to removeStudent");
      const [err, usersList] = await asyncHandler(
        userServices.deleteStudent(req.params.student_id)
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!usersList) {
        throw new CustomError({
          message: "Student doesnt exist",
          statusCode: 404,
        });
      }
      usersList.logo
        ? fs.unlinkSync("files/logo/" + usersList.logo.split("/").pop())
        : null;
      return successHandler(res, { message: "Student removed successfully" });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static updateStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to updateStudent");
      const [err, studentDetail] = await asyncHandler(
        userServices.updateStudent({ _id: req.user.kind && req.user.kind=='Student'?req.user._id:req.params.student_id }, req.body)
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!studentDetail) {
        throw new CustomError({
          message: "Student doesnt exist",
          statusCode: 404,
        });
      }
      return successHandler(res, {
        message: "Student updated successfully",
        data: studentDetail,
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static addLogo = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to addLogo");
      const [err, logoDetails] = await asyncHandler(
        userServices.createLogo(
          req.user._id,
          envOptions.API_URL + "/student/logos/" + req.file?.filename
        )
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, {
        message: "Logo created successfully",
        data: logoDetails,
      });
    } catch (err) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return errorHandler(res, err);
    }
  };

  static removeLogo = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to addLogo");
      const [err, logoDetails] = await asyncHandler(
        userServices.createLogo(req.user._id, null)
      );
      if (err) {
        throw new CustomError(err);
      }
      logoDetails.logo
        ? fs.unlinkSync("files/logo/" + logoDetails.logo.split("/").pop())
        : null;
      return successHandler(res, {
        message: "Logo removed successfully",
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static addGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to addGroup");
      const { group } = req.body;
      const [err, groupDetails] = await asyncHandler(
        userServices.createGroup(group)
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, {
        message: "Group added successfully",
        data: groupDetails,
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static listStudentsUnderGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listStudentsUnderGroup");
      const [err, groupDetails] = await asyncHandler(
        userServices.getStudentsUnderGroup()
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, {
        message: "List all students under group successfully",
        data: groupDetails
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static removeGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to removeGroup");
      const { group_id } = req.params;
      const [err, groupDetails] = await asyncHandler(
        userServices.deleteGroup(group_id)
      );
      if (err) {
        throw new CustomError(err);
      }
      if (!groupDetails) {
        throw new CustomError({
          message: "Group doesnt exist",
          statusCode: 404,
        });
      }
      return successHandler(res, { message: "Group removed successfully" });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static listGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listGroup");
      const [err, groupDetails] = await asyncHandler(
        userServices.getAllGroup()
      );
      if (err) {
        throw new CustomError(err);
      }
      return successHandler(res, {
        message: "List all groups successfully",
        data: groupDetails,
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static addTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to addTeacher");
      const [err, roleId] = await asyncHandler(
        userServices.getUserRole("Teacher")
      );
      if (err) {
        throw new CustomError(err);
      }
      const tempPassword = Math.random().toString(36).slice(-8);
      const [teacherErr, teacherDetails] = await asyncHandler(
        userServices.createTeacher([
          {
            role: roleId._id,
            password: tempPassword,
            ...req.body,
          },
        ])
      );
      if (teacherErr) {
        throw new CustomError(teacherErr);
      }
      const link = `${envOptions.BASE_URL}`;
      await registerationEmail(
        teacherDetails[0].email,
        link,
        tempPassword
      );
      return successHandler(res, { message: "Teacher added successfully" });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static addBulkTeacher = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      logger.info("Incoming request to addBulkTeacher");
      let data: Array<Record<string, unknown>> = [];
      const link = `${envOptions.BASE_URL}`;
      if (req.file?.mimetype.split("/")[1] == "csv") {
        parseFile(req.file.path, { headers: true })
          .transform(
            ({
              is_active,
              password,
              token,
              group_id,
              ...others
            }: any) => ({
              is_active: JSON.parse(is_active),
              password: JSON.parse(password),
              token: JSON.parse(token),
              group_id: JSON.parse(group_id),
              ...others,
            })
          )
          .on("error", (error) => {
            fs.unlinkSync(`${req.file?.path}`);
            throw new CustomError(error);
          })
          .on("data", async (row) => {
            const tempPassword = Math.random().toString(36).slice(-8);
            data.push({ password: tempPassword, ...row });
          })
          .on("end", async () => {
            try {
              const [teacherErr, teacher] = await asyncHandler(
                userServices.createTeacher(data)
              );
              if (teacherErr) {
                throw new CustomError(teacherErr);
              }
              for (const row of data) {
                const { email, password }: any = row;
                await registerationEmail(email, link, password);
              }
              fs.unlinkSync(`${req.file?.path}`);
              return successHandler(res, {
                message: "Bulk Teachers added successfully",
              });
            } catch (err) {
              fs.unlinkSync(`${req.file?.path}`);
              return errorHandler(res, err);
            }
          });
      } else {
        data = JSON.parse(fs.readFileSync(`${req.file?.path}`, "utf-8"));
        const newData = data.map(
          ({ role, group_id = null, ...others }: any) => {
            const tempPassword = Math.random().toString(36).slice(-8);
            return {
              role: role["$oid"],
              password: tempPassword,
              group_id: group_id["$oid"] ?? [],
              ...others,
            };
          }
        );
        for (const row of newData) {
          await registerationEmail(row.email, link, row.password);
        }
        const [teacherErr, teacher] = await asyncHandler(
          userServices.createTeacher(newData)
        );
        if (teacherErr) {
          throw new CustomError(teacherErr);
        }
        fs.unlinkSync(`${req.file?.path}`);
        return successHandler(res, {
          message: "Bulk Teachers added successfully",
        });
      }
    } catch (err) {
      fs.unlinkSync(`${req.file?.path}`);
      return errorHandler(res, err);
    }
  };

  static listTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to listTeacher");
      const [teacherErr, teacherDetails] = await asyncHandler(
        userServices.getAllTeacher(req.query)
      );
      if (teacherErr) {
        throw new CustomError(teacherErr);
      }
      const [{ total_count, paginated_data }] = teacherDetails;
      return successHandler(
        res,
        {
          count: total_count[0]?.count,
          message: "List of teachers",
          data: paginated_data,
        },
        req.query
      );
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static removeTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to removeTeacher");
      const [teacherErr, teacherDetails] = await asyncHandler(
        userServices.deleteUser(req.params.teacher_id)
      );
      if (teacherErr) {
        throw new CustomError(teacherErr);
      }
      if (!teacherDetails) {
        throw new CustomError({
          message: "Teacher doesnt exist",
          statusCode: 404,
        });
      }
      return successHandler(res, { message: "Teacher removed successfully" });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static updateTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to updateTeacher");
      const [teacherErr, teacherDetails] = await asyncHandler(
        userServices.updateTeacher({ _id: req.params.teacher_id }, req.body)
      );
      if (teacherErr) {
        throw new CustomError(teacherErr);
      }
      if (!teacherDetails) {
        throw new CustomError({
          message: "Teacher doesnt exist",
          statusCode: 404,
        });
      }
      return successHandler(res, {
        message: "Teacher updated successfully",
        data: teacherDetails,
      });
    } catch (err) {
      return errorHandler(res, err);
    }
  };

  static addAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Incoming request to addAdmin");
      const [err, roleId] = await asyncHandler(
        userServices.getUserRole("Admin")
      );
      if (err) {
        throw new CustomError(err);
      }
      const tempPassword = Math.random().toString(36).slice(-8);
      const [adminErr, adminDetails] = await asyncHandler(
        userServices.createUser({
          role: roleId._id,
          password: tempPassword,
          ...req.body,
        })
      );
      if (adminErr) {
        throw new CustomError(adminErr);
      }
      const link = `${envOptions.BASE_URL}`;
      await registerationEmail(
        adminDetails.email,
        link,
        tempPassword
      );
      return successHandler(res, {
        message: "Admin added successfully",
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
