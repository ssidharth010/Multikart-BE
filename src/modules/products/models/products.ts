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
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      subcategory_id: {
        type: String,
        required: true,
      },
      images: {
        type: Array,
        required: true
      },
      details: {
        type: Array,
        required: true
      },
      more: {
        type: Array,
        required: false,
        default: []
      },
    });
    return instance.model<IProducts>("Products", productsSchema);
  }
}
