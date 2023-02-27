import express from "express";
import { IRouter } from "../../../config/interface";
import { checkSchema } from "express-validator";
import { validate } from "../../../utils/validate";
import { authorization } from "../../../utils/authorization";
import { UserRouteHandler } from "./routeHandler";
import {
  addCustomerValidation,
  updateCustomerValidation,
  updateAdminValidation,
  list,
  addAdminValidation,
  updateCustomerCart
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
     this.publicRouter.post(
      "/customer/add",
      checkSchema(addCustomerValidation),
      validate(Object.keys(addCustomerValidation)),
      UserRouteHandler.addCustomer
    );

    // this.privateRouter.get(
    //   "/student/list",
    //   authorization(["AddCustomer"]),
    //   checkSchema(list),
    //   validate(Object.keys(list)),
    //   UserRouteHandler.listCustomer
    // );

    // this.privateRouter.delete(
    //   "/student/remove/:student_id",
    //   authorization(["RemoveCustomer"]),
    //   checkSchema(updateCustomerValidation),
    //   validate(Object.keys(updateCustomerValidation)),
    //   UserRouteHandler.removeCustomer
    // );

    this.privateRouter.put(
      "/update/cart",
      checkSchema(updateCustomerCart),
      validate(Object.keys(updateCustomerValidation)),
      UserRouteHandler.updateCustomerCart
    );

    this.publicRouter.post(
      "/add",
      checkSchema(addAdminValidation),
      validate(Object.keys(addAdminValidation)),
      UserRouteHandler.addAdmin
    );


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
