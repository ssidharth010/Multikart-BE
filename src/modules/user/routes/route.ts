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
     * v1/user/student/add:
     *   post:
     *     tags: ["User"]
     *     description: Add student
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
     *             studentID:
     *               type: string
     *             group_id:
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
     *                   example: 'Student added successfully'
     */

    this.publicRouter.post(
      "/student/add",
      checkSchema(addStudentValidation),
      validate(Object.keys(addStudentValidation)),
      UserRouteHandler.addStudent
    );

    
    /**
     * @swagger
     * v1/user/student/list:
     *   get:
     *     tags: ["User"]
     *     description: Add student
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
     *       - name: group
     *         description: filter by group name
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
     *                   example: 'List all student successfully'
     *                 data:
     *                   type: object
     *                   description: user details.
     *                   example: []
     */

    this.privateRouter.get(
      "/student/list",
      checkSchema(list),
      validate(Object.keys(list)),
      UserRouteHandler.listStudent
    );

    /**
     * @swagger
     * v1/user/student/remove/{student_id}:
     *   delete:
     *     tags: ["User"]
     *     description: Remove student
     *     parameters:
     *       - name: Authorization
     *         description: authorization header
     *         in: header
     *         type: string
     *       - name: student_id,
     *         description: Student id
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
     *                   example: 'Student removed successfully'
     *
     */

    this.privateRouter.delete(
      "/student/remove/:student_id",
      authorization(["RemoveStudent"]),
      checkSchema(updateStudentValidation),
      validate(Object.keys(updateStudentValidation)),
      UserRouteHandler.removeStudent
    );

    /**
     * @swagger
     * v1/user/student/update/{student_id}:
     *   put:
     *     tags: ["User"]
     *     description: Update student
     *     parameters:
     *       - name: Authorization
     *         description: authorization header
     *         in: header
     *         type: string
     *       - name: student_id,
     *         description: Student id
     *         in: params,
     *         type: string
     *       - name: Request
     *         description: request body
     *         in: body
     *         schema:
     *           type: object
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
     *                   example: 'Student updated successfully'
     *                 data:
     *                   type: object
     *                   description: user details.
     *                   example: {}
     *
     */

    this.privateRouter.put(
      "/student/update/:student_id",
      authorization(["UpdateStudent"]),
      checkSchema(updateStudentValidation),
      validate(Object.keys(updateStudentValidation)),
      UserRouteHandler.updateStudent
    );

    /**
     * @swagger
     * v1/user/student/update:
     *   patch:
     *     tags: ["User"]
     *     description: Update student
     *     parameters:
     *       - name: Authorization
     *         description: authorization header
     *         in: header
     *         type: string
     *       - name: student_id,
     *         description: Student id
     *         in: params,
     *         type: string
     *       - name: Request
     *         description: request body
     *         in: body
     *         schema:
     *           type: object
     *           properties:
     *             location:
     *               type: string
     *             store_layout:
     *               type: string
     *             amount: 
     *               type: number
     *             services:
     *               type: array
     *               items:
     *                 type: string 
     *             equipments:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   model:
     *                     type: string
     *                   price_per_cycle:
     *                     type: number
     *                   quantity:
     *                     type: number
     *                   is_purchase:
     *                     type: boolean
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
     *                   example: 'Student updated successfully'
     *                 data:
     *                   type: object
     *                   description: user details.
     *                   example: {}
     *
     */

    this.privateRouter.patch(
      "/student/update",
      checkSchema(updateSelfStudentValidation),
      validate(Object.keys(updateSelfStudentValidation)),
      UserRouteHandler.updateStudent
    );
  }
}

export const userRouter = new UserRouter();
