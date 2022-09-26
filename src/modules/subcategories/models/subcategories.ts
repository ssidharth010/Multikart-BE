import { Connection, Mongoose, Model, Document } from "mongoose";
interface ISubCategories extends Document {
  name: string;
  category_id: string;
}
export class SubCategories {
  static setup(orm: Mongoose, instance: Connection): Model<ISubCategories> {
    const subcategoriesSchema = new orm.Schema({
      name: {
        type: String,
        required: true,
      },
      category_id: {
        type: String,
        required: true
      }
    });
    return instance.model<ISubCategories>("SubCategories", subcategoriesSchema);
  }
}
