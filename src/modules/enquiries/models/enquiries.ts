import { Connection, Mongoose, Model, Document } from "mongoose";
interface IEnquiries extends Document {
  title: string;
}
export class Enquiries {
  static setup(orm: Mongoose, instance: Connection): Model<IEnquiries> {
    const enquiriesSchema = new orm.Schema({
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      address: {
        type: String,
        required: true,
      },
      product_ids: {
        type: Array,
        default : [],
        required: true,
      },
      created_date: {
        type: Date,
        required: true,
        default: new Date()
      }
    });
    return instance.model<IEnquiries>("Enquiries", enquiriesSchema);
  }
}
