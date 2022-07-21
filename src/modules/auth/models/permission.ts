import { Connection, Mongoose, Model, Document } from "mongoose";
interface IPermission extends Document {
  name: string;
}
export class Permission {
  static setup(orm: Mongoose, instance: Connection): Model<IPermission> {
    const permissionSchema = new orm.Schema({
      name: {
        type: String,
        required: true,
      },
    });

    return instance.model<IPermission>("Permission", permissionSchema);
  }
}
