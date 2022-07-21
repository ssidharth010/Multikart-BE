import { Connection, Mongoose, Model, Document } from "mongoose";
interface IGroup extends Document {
  name: string;
}
export class Group {
  static setup(orm: Mongoose, instance: Connection): Model<IGroup> {
    const groupSchema = new orm.Schema({
      name: {
        type: String,
        required: true,
        unique: true,
      },
    });

    return instance.model<IGroup>("Group", groupSchema);
  }
}
