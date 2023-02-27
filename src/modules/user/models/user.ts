import bcrypt from "bcrypt";
import { Connection, Mongoose, Model, Document } from "mongoose";
interface IUser extends Document {
  first_name: string;
}
export class User {
  static setup(orm: Mongoose, instance: Connection): Model<IUser> {
    const userSchema = new orm.Schema(
      {
        first_name: {
          type: String,
          required: true,
          set: (val: string) => {
            return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
          },
        },
        last_name: {
          type: String,
          required: true,
          set: (val: string) => {
            return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
          },
        },
        cart_items: {
          type: String,
          required: false,
          default: null,
        },
        email: {
          type: String,
          unique: true,
          required: true,
          validate: {
            validator: function (v: string) {
              return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid email!`,
          },
        },
        password: {
          type: String,
          default: null,
          set: (val: string | null) => {
            if (val) {
              return bcrypt.hashSync(val, 10);
            }
          },
        },
        token: {
          type: String,
          default: null,
        },
        reset_password_token: {
          type: String,
          default: null,
        },
        is_active: {
          type: Boolean,
          required: true,
          default: false,
        },
        created_date: {
          type: Date,
          required: true,
          default: new Date()
        }
      }
    );
    return instance.model<IUser>("User", userSchema);
  }
}
