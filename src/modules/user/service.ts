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

  async createStudent(body: Array<Record<string, unknown>>) {
    const session = await this.db1Collection.instance.startSession();
    try {
      let data;
      await session.withTransaction(async () => {
        data = await this.db1Collection.instance.models.Student.create(body, {
          session: session
        });
        if(data[0].group_id) {
          await this.db1Collection.instance.models.Quiz.updateMany({group: {$in: [data[0].group_id]}}, {$addToSet: {target: data[0]._id}}, {session:session})
        }
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

  async getAllStudents(query: Record<string, unknown>) {
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

    return this.db1Collection.instance.models.Student.aggregate([
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

  async deleteStudent(studentId: string) {
    return this.db1Collection.instance.models.Student.findByIdAndDelete({
      _id: studentId,
    });
  }

  async createLogo(studentId: string, logo: string | null) {
    return this.db1Collection.instance.models.Student.findOneAndUpdate(
      {
        _id: studentId,
      },
      { logo }
    );
  }

  async createGroup(group: string) {
    return this.db1Collection.instance.models.Group.create({ name: group });
  }

  async getStudentsUnderGroup() {
    return this.db1Collection.instance.models.Student.aggregate([
      {
        $lookup: {
          from: "groups",
          localField: "group_id",
          foreignField: "_id",
          as: "group_id",
        }
      },
      {
        $unwind: "$group_id"
      },
      {
        $group: {
          _id: {
            group_id: "$group_id._id",
            name: "$group_id.name"
          },
          students: {
            $push: {first_name:"$first_name",last_name: "$last_name",_id:"$_id"}
          }
        }
      },
    ]);
  }


  async deleteGroup(id: string) {
    const session = await this.db1Collection.instance.startSession();
    try {
      const result = await session.withTransaction(async () => {
        await this.db1Collection.instance.models.Group.findByIdAndDelete(id, {session:session});
        await this.db1Collection.instance.models.Student.updateMany({ group_id: id }, { group_id: null },{session:session});
        await this.db1Collection.instance.models.Teacher.updateMany({}, { $pull: {group_id: id}},{session:session});
      })
      session.endSession();
      return result
    } catch (err) {
      session.endSession();
      throw new CustomError(err);
    }
  }

  async updateStudent(
    by: Record<string, unknown>,
    body: Record<string, unknown>
  ) {
    const session = await this.db1Collection.instance.startSession();
    try {
      let data;
      await session.withTransaction(async () => {
        data = await this.db1Collection.instance.models.Student.findOneAndUpdate(
          by,
          body,
          { new: true, session:session }
        );
        if(body.group_id) {
          await this.db1Collection.instance.models.Quiz.updateMany({group: {$in: [data.group_id]}}, {$addToSet: {target: data._id}}, {session:session})
        }
      });
      session.endSession();
      return data;
    } catch (err) {
      session.endSession();
      throw new CustomError(err);
    }
  }

  async getAllGroup() {
    return this.db1Collection.instance.models.Group.find();
  }

  async createUser(body: Record<string, unknown>) {
    return this.db1Collection.instance.models.User.create(body);
  }

  async createTeacher(body: Array<Record<string, unknown>>) {
    const session = await this.db1Collection.instance.startSession();
    try {
      let data;
      await session.withTransaction(async () => {
        data = await this.db1Collection.instance.models.Teacher.create(body, {
          session: session,
        });
      });
      session.endSession();
      return data;
    } catch (err) {
      session.endSession();
      throw new CustomError(err);
    }
  }

  async updateTeacher(
    by: Record<string, unknown>,
    body: Record<string, unknown>
  ) {
    return this.db1Collection.instance.models.Teacher.findOneAndUpdate(
      by,
      body,
      { new: true }
    );
  }

  async getAllTeacher(query: Record<string, unknown>) {
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

    return this.db1Collection.instance.models.Teacher.aggregate([
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
        },
      },
      paginationAndSort,
    ]);
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
