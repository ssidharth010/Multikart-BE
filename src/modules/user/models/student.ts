import { Connection, Mongoose, Model, Document } from "mongoose";
interface IStudent extends Document {
  studentID: string;
}

export class Student {
  static setup(orm: Mongoose, instance: Connection): Model<IStudent> {
    const options = { discriminatorKey: "kind" };
    const studentSchema = new orm.Schema(
      {
        studentID: {
          type: String,
          required: true,
          unique: true,
        },
        group_id: {
          type: orm.Schema.Types.ObjectId,
          ref: "Group",
        },
        amount: {
          type: Number,
          required: true,
          default: 10000,
        },
        rewards: {
          type: Number,
          required: true,
          default: 0,
        },
        logo: {
          type: String,
        },
        location: {
          type: orm.Schema.Types.ObjectId,
          ref: "Location",
        },
        equipments: [
          {
            model: {
              type: orm.Schema.Types.ObjectId,
              ref: "Equipment"
            },
            price_per_cycle: {
              type: Number,
              required: true
            },
            quantity: {
              type: Number,
              required: true
            },
            is_purchase: {
              type: Boolean
            }
          }
        ],
        marketing: [{
          marketing_id: {
            type: orm.Schema.Types.ObjectId,
            ref: "Marketing_Strategy"
          },
          quantity: {
            type: Number,
            required: true
          }
        }],
        services: [
          {
            type: orm.Schema.Types.ObjectId,
            ref: "Service"
          }
        ],
        // store_layout: {
        //   type: orm.Schema.Types.ObjectId,
        //   ref: "Store_Layout",
        // },
        quiz: [
          {
            _id: false,
            quiz_id: {
              type: orm.Schema.Types.ObjectId,
              ref: "Quiz",
              unique: true
            },
            status: {
              type: String,
              enum: ["Evaluated", "Not-Evaluated","Skipped"],
              default: "Not-Evaluated"
            },
            submitted_date: {
              type: Date
            },
            pass: {
              type: Boolean,
              default: false
            }
          }
        ]
      },
      options
    )

    studentSchema.pre("findOneAndDelete", async function (this:any,next) {
      await instance.models.Quiz.updateMany({},{$pull: {target: this._conditions._id}})
      next()
    })

    return instance.models.User.discriminator(
      "Student",
      studentSchema
    );
  }
}
