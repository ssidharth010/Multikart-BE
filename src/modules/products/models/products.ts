import { Connection, Mongoose, Model, Document } from "mongoose";
interface IProducts extends Document {
  title: string;
}
export class Products {
  static setup(orm: Mongoose, instance: Connection): Model<IProducts> {
    const productsSchema = new orm.Schema({
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      images: {
        type: Array,
        required: true
      },
    });
    return instance.model<IProducts>("Products", productsSchema);
  }
}
