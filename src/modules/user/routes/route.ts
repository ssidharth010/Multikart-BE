import express from "express";
import { IRouter } from "../../../config/interface";
import { checkSchema } from "express-validator";
import { validate } from "../../../utils/validate";
import { authorization } from "../../../utils/authorization";
import { UserRouteHandler } from "./routeHandler";
import {
  addStudentValidation,
  updateStudentValidation,
  addGroupValidation,
  removeGroupValidation,
  updateSuperAdminValidation,
  updateTeacherValidation,
  updateAdminValidation,
  addPermissionValidation,
  list,
  updateSelfStudentValidation,
  addAdminValidation,
  addTeacherValidation,
} from "../middlewares/fieldValidation";
import { upload } from "../../../utils/uploadFile";

class UserRouter implements IRouter {
  public publicRouter;
  public privateRouter;

  constructor() {
    this.publicRouter = express.Router();
    this.privateRouter = express.Router();
    this.getRoutes();
  }

  getRoutes() {
    /**
     * @swagger
     * v1/user/admin/add:
     *   post:
     *     tags: ["User"]
     *     description: Add Admin
     *     parameters:
     *       - name: Authorization
     *         description: authorization header
     *         in: header
     *         type: string
     *       - name: Request
     *         description: request body
     *         in: body
     *         schema:
     *           type: object
     *           properties:
     *             first_name:
     *               type: string
     *             last_name:
     *               type: string
     *             email:
     *               type: string
     *             phone_number:
     *               type: string
     *
     *     responses:
     *       '200':
     *         description: Success response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Success response
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: success message.
     *                   example: 'Admin added successfully'
     *
     */

    this.publicRouter.post(
      "/add",
      checkSchema(addAdminValidation),
      validate(Object.keys(addAdminValidation)),
      UserRouteHandler.addAdmin
    );

    /**
     * @swagger
     * v1/user/admin/list:
     *   get:
     *     tags: ["User"]
     *     description: List all admin
     *     parameters:
     *       - name: Authorization
     *         description: authorization header
     *         in: header
     *         type: string
     *       - name: per_page
     *         description: count per page
     *         in: query
     *         type: string
     *       - name: current_page
     *         description: current page number
     *         in: query
     *         type: string
     *       - name: sort_by
     *         description: sort column
     *         in: query
     *         type: string
     *       - name: sort_dir
     *         description: sort order
     *         in: query
     *         type: string
     *       - name: name
     *         description: filter by firstname
     *         in: query
     *         type: string
     *       - name: email
     *         description: filter by email
     *         in: query
     *         type: string
     *
     *     responses:
     *       '200':
     *         description: Success response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Success response
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: success message.
     *                   example: 'List all admins'
     *                 data:
     *                   type: object
     *                   description: admin details.
     *                   example: []
     *
     */

    this.privateRouter.get(
      "/admin/list",
      authorization(["AddAdmin"]),
      checkSchema(list),
      validate(Object.keys(list)),
      UserRouteHandler.listAdmin
    );

    /**
     * @swagger
     * v1/user/admin/remove/{admin_id}:
     *   delete:
     *     tags: ["User"]
     *     description: Remove admin
     *     parameters:
     *       - name: Authorization
     *         description: authorization header
     *         in: header
     *         type: string
     *       - name: admin_id,
     *         description: Admin Id
     *         in: params,
     *         type: string
     *
     *     responses:
     *       '200':
     *         description: Success response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Success response
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: success message.
     *                   example: 'Admin removed successfully'
     *
     */

    this.privateRouter.delete(
      "/admin/remove/:admin_id",
      authorization(["RemoveAdmin"]),
      checkSchema(updateAdminValidation),
      validate(Object.keys(updateAdminValidation)),
      UserRouteHandler.removeAdmin
    );

    /**
     * @swagger
     * v1/user/admin/update/{admin_id}:
     *   put:
     *     tags: ["User"]
     *     description: Update admin
     *     parameters:
     *       - name: Authorization
     *         description: authorization header
     *         in: header
     *         type: string
     *       - name: admin_id,
     *         description: Admin Id
     *         in: params,
     *         type: string
     *       - name: Request
     *         description: request body
     *         in: body
     *         schema:
     *           type: object
     *           properties:
     *             first_name:
     *               type: string
     *             last_name:
     *               type: string
     *             email:
     *               type: string
     *             phone_number:
     *               type: string
     *
     *     responses:
     *       '200':
     *         description: Success response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Success response
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: success message.
     *                   example: 'Admin updated successfully'
     *
     */

    this.privateRouter.put(
      "/admin/update/:admin_id",
      authorization(["UpdateAdmin"]),
      checkSchema(updateAdminValidation),
      validate(Object.keys(updateAdminValidation)),
      UserRouteHandler.updateAdmin
    );
  }
}

export const userRouter = new UserRouter();
