import { Connection, Mongoose, Model, Document } from "mongoose";
interface IRole extends Document {
  name: string;
}
export class Role {
  static setup(orm: Mongoose, instance: Connection): Model<IRole> {
    const roleSchema = new orm.Schema({
      name: {
        type: String,
        required: true,
      },
      permission: [
        {
          type: orm.Schema.Types.ObjectId,
          ref: "Permission",
        },
      ],
    });

    return instance.model<IRole>("Role", roleSchema);
  }
}
