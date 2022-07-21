import { Connection, Mongoose, Model, Document } from "mongoose";
interface ITeacher extends Document {
  group_id: Array<string>;
}
export class Teacher {
  static setup(orm: Mongoose, instance: Connection): Model<ITeacher> {
    const options = { discriminatorKey: "kind" };
    return instance.models.User.discriminator(
      "Teacher",
      new orm.Schema(
        {
          group_id: [
            {
              type: orm.Schema.Types.ObjectId,
              ref: "Group",
            },
          ],
        },
        options
      )
    );
  }
}
