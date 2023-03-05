import { collection } from "../../config/dbCollection";
import { IService } from "../../config/interface";
import {
  paginationAndSortAggregate,
} from "../../utils/sort&pagination";
import mongoose from "mongoose";
import { CustomError } from "../../utils/customError";

class UserServices implements IService {
  public db1Collection;

  constructor(collection: any) {
    this.db1Collection = collection.db1Inst;
  }

  async createCustomer(body: Array<Record<string, unknown>>) {
    const session = await this.db1Collection.instance.startSession();
    try {
      let data;
      await session.withTransaction(async () => {
        data = await this.db1Collection.instance.models.User.create(body, {
          session: session
        });
      });
      session.endSession();
      return data;
    } catch (err) {
      session.endSession();
      throw new CustomError(err);
    }
  }

  async getUserRole(role: string) {
    return this.db1Collection.instance.models.Role.findOne({
      name: role,
    }).select("_id");
  }

  async getAllCustomers(query: Record<string, unknown>) {
    if (query.sort_by == "group") {
      query.sort_by = "group_id.name";
    }
    const paginationAndSort = paginationAndSortAggregate(query);
    let userMatch = {};
    if (query.name) {
      userMatch = { first_name: { $regex: query.name, $options: "i" } };
    }
    if (query.email) {
      userMatch = { email: { $regex: query.email, $options: "i" } };
    }
    if (query.group) {
      userMatch = { "group_id.name": { $regex: query.group, $options: "i" } };
    }

    return this.db1Collection.instance.models.Customer.aggregate([
      {
        $lookup: {
          from: "groups",
          localField: "group_id",
          foreignField: "_id",
          as: "group_id",
        },
      },
      {
        $match: userMatch,
      },
      {
        $project: {
          first_name: 1,
          last_name: 1,
          email: 1,
          phone_number: 1,
          group_id: 1,
          is_active: 1,
          studentID: 1,
        },
      },
      paginationAndSort,
    ]);
  }

  async deleteCustomer(studentId: string) {
    return this.db1Collection.instance.models.Customer.findByIdAndDelete({
      _id: studentId,
    });
  }

  async updateCustomer(
    by: Record<string, unknown>,
    body: Record<string, unknown>
  ) {
    const session = await this.db1Collection.instance.startSession();
    try {
      let data;
      await session.withTransaction(async () => {
        data = await this.db1Collection.instance.models.User.findOneAndUpdate(
          by,
          body,
          { new: true, session:session }
        );
      });
      session.endSession();
      return data;
    } catch (err) {
      session.endSession();
      throw new CustomError(err);
    }
  }

  async getCustomerCart(body: Record<string, unknown>) {
    return this.db1Collection.instance.models.User.findOne(
      body,
      "cart_items"
    );
  }

  async updateCustomerCart(
    where: Record<string, unknown>,
    field: Record<string, unknown>
  ) {
    return this.db1Collection.instance.models.User.findOneAndUpdate(
      where,
      field,
      { new: true }
    );
}


  async createUser(body: Record<string, unknown>) {
    return this.db1Collection.instance.models.User.create(body);
  }

  async getAllUser(query: Record<string, unknown>, role: string) {
    const paginationAndSort = paginationAndSortAggregate(query);
    let userMatch = {};
    if (query.name) {
      userMatch = { first_name: { $regex: query.name, $options: "i" } };
    }
    if (query.email) {
      userMatch = { email: { $regex: query.email, $options: "i" } };
    }

    return this.db1Collection.instance.models.User.aggregate([
      {
        $match: { role, ...userMatch },
      },
      {
        $project: {
          first_name: 1,
          last_name: 1,
          email: 1,
          phone_number: 1,
          group_id: 1,
          is_active: 1,
        },
      },
      paginationAndSort,
    ]);
  }

  async deleteUser(userId: string) {
    return this.db1Collection.instance.models.User.findOneAndDelete({
      _id: userId,
    });
  }

  async updateUser(by: Record<string, unknown>, body: Record<string, unknown>) {
    return this.db1Collection.instance.models.User.findOneAndUpdate(by, body, {
      fields: {
        _id: 1,
        first_name: 1,
        last_name: 1,
        email: 1,
        phone_number: 1,
        token: 1
      },
      new: true,
    });
  }

  async updateRolePermissions(roleId: string, permissionId: string) {
    const permissionObjId = new mongoose.Types.ObjectId(permissionId);

    return this.db1Collection.instance.models.Role.updateOne(
      { _id: roleId },
      [
        {
          $set: {
            permission: {
              $cond: [
                {
                  $in: [permissionObjId, "$permission"],
                },
                {
                  $setDifference: ["$permission", [permissionObjId]],
                },
                {
                  $concatArrays: ["$permission", [permissionObjId]],
                },
              ],
            },
          },
        },
      ],
      null
    );
  }

  async getAllPermission() {
    return this.db1Collection.instance.models.Role.aggregate([
      {
        $match: {
          name: { $ne: "SuperAdmin" },
        },
      },
      {
        $lookup: {
          from: "permissions",
          localField: "permission",
          foreignField: "_id",
          as: "permission",
        },
      },
      {
        $unwind: {
          path: "$permission",
        },
      },
      {
        $group: {
          _id: "$permission",
        },
      },
    ]);
  }

  async getPermission() {
    return this.db1Collection.instance.models.Role.aggregate([
      {
        $lookup: {
          from: "permissions",
          localField: "permission",
          foreignField: "_id",
          as: "permission",
        },
      },
    ]);
  }

  async getRoleForPermission() {
    return this.db1Collection.instance.models.Permission.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "_id",
          foreignField: "permission",
          as: "role",
        },
      },
      {
        $project: { _id: 1, name: 1, "role._id": 1, "role.name": 1 },
      },
    ]);
  }
}

export const userServices = new UserServices(collection);
