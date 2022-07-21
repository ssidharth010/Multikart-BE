import express from "express";
import { IRouter } from "../../../config/interface";
import { checkSchema } from "express-validator";
import {
  loginValidation,
  forgotPasswordValidation,
  changePasswordValidation,
} from "../middlewares/fieldValidation";
import { validate } from "../../../utils/validate";
import { AuthRouteHandler } from "./routeHandler";

class AuthRouter implements IRouter {
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
     * v1/auth/login:
     *   post:
     *     tags: ["Auth"]
     *     description: User login
     *     parameters:
     *       - name: Request
     *         description: request body
     *         in: body
     *         schema:
     *           type: object
     *           properties:
     *             email:
     *               type: string
     *             password:
     *               type: string
     *
     *     responses:
     *       '200':
     *         description: Success response
     *         content:
     *           application/json:
     *           schema:
     *             type: object
     *             properties:
     *                 success:
     *                   type: boolean
     *                   description: Success response
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: success message.
     *                   example: 'User exist'
     *                 data:
     *                   type: object
     *                   description: user info
     *                   example: { "_id": "61418ad312432bf195e0d1c1", "first_name": "Nikhil", "last_name": "A", "email": "nikku.a1998@gmail.com", "phone_number": "849845157", "role": { "_id": "6140ec466d47c8fc8f330d4c", "name": "SuperAdmin", "permission": [ { "_id": "614aee2169261552a2ed93a4", "name": "RemoveGroup" }, ] }, "token": null, "reset_password_token": null, "is_active": true }
     */
    this.publicRouter.post(
      "/login",
      checkSchema(loginValidation),
      validate(Object.keys(loginValidation)),
      AuthRouteHandler.login
    );

    /**
     * @swagger
     * v1/auth/password/forgot:
     *   post:
     *     tags: ["Auth"]
     *     description: Forgot password
     *     parameters:
     *       - name: Request
     *         description: request body
     *         in: body
     *         schema:
     *           type: object
     *           properties:
     *             email:
     *               type: string
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
     *                   example: 'Mail sent for reset'
     */
    this.publicRouter.post(
      "/password/forgot",
      checkSchema(forgotPasswordValidation),
      validate(Object.keys(forgotPasswordValidation)),
      AuthRouteHandler.forgotPassword
    );

    /**
     * @swagger
     * v1/auth/password/change:
     *   post:
     *     tags: ["Auth"]
     *     description: Change password
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
     *             old_password:
     *               type: string
     *             new_password:
     *               type: string
     *             confirm_password:
     *               type: string
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
     *                   example: ' in successfully'
     */
    this.privateRouter.post(
      "/password/change",
      checkSchema(changePasswordValidation),
      validate(Object.keys(changePasswordValidation)),
      AuthRouteHandler.changePassword
    );

    /**
     * @swagger
     * v1/auth/logout:
     *   post:
     *     tags: ["Auth"]
     *     description: Logout
     *     parameters:
     *       - name: Authorization
     *         description: authorization header
     *         in: header
     *         type: string
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
     *                   example: 'User logged out successfully'
     *
     */
    this.privateRouter.post("/logout", AuthRouteHandler.logout);
  }
}

export const authRouter = new AuthRouter();
