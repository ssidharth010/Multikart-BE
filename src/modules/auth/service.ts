import { collection } from "../../config/dbCollection";
import { IService } from "../../config/interface";

class AuthServices implements IService {
  public db1Collection;

  constructor(collection: any) {
    this.db1Collection = collection.db1Inst;
  }

  async getUserByField(field: Record<string, unknown>) {
    return this.db1Collection.instance.models.User.find(field);
  }

  async updateUserField(
    where: Record<string, unknown>,
    field: Record<string, unknown>
  ) {
    return this.db1Collection.instance.models.User.findOneAndUpdate(
      where,
      field,
      { new: true }
    );
  }

  async getUserPermissions(field: Record<string, unknown>,condition: Record<string, unknown>={}) {
    if(!Object.keys(condition).length) {
      return this.db1Collection.instance.models.User.findOne(field, "-password")
      .populate({
        path: "role",
        populate: { path: "permission" },
      })
      .exec();
    }
    if(condition.role) {
      return this.db1Collection.instance.models.User.findOne(field, "role")
      .populate({
        path: "role"
      })
      .exec();
    }
    if(condition.password) {
      return this.db1Collection.instance.models.User.findOne(field, "password")
    }
    
  }
}

export const authServices = new AuthServices(collection);
