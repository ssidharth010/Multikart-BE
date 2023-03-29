import { Connection, Mongoose, Model, Document } from "mongoose";
interface ICategories extends Document {
  title: string;
}
export class Categories {
  static setup(orm: Mongoose, instance: Connection): Model<ICategories> {
    const categoriesSchema = new orm.Schema({
      name: {
        type: String,
        unique: true,
        required: true,
      },
    });
    return instance.model<ICategories>("Categories", categoriesSchema);
  }
}
