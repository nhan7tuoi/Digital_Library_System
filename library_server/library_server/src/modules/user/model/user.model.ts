import mongoose from "mongoose";
import { Gender, Role, UserStatus } from "../types/user.type";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, index: true },
    gender: {
      type: String,
      enum: [Gender.Male, Gender.Female],
      default: Gender.Male,
    },
    dob: { type: Date },
    email: { type: String, required: true },
    password: { type: String, required: true },
    majors: { type: mongoose.Schema.Types.ObjectId, ref: "Majors" },
    role: { type: String, enum: [Role.Admin, Role.User], default: Role.User },
    status: {
      type: String,
      enum: [
        UserStatus.Banned,
        UserStatus.Deleted,
        UserStatus.Active,
        UserStatus.Pending,
      ],
      default: UserStatus.Pending,
    },
    emailId:{type:String},
    code: { type: String, index: true },
    image: {
      type: String,
      default:
        "https://pdf8888.s3.ap-southeast-1.amazonaws.com/avata_default.jpg",
    },
    notifications: [
      {
        notification: {type:mongoose.Schema.Types.ObjectId, ref: "Notification"},
        isRead: {type: Boolean, default: false}
      }
    ],
    devices:[
      {
        device_id: {type: String},
        fcm_token: {type: String},
        platform: {type: String}
      }
    ]
  },
  { timestamps: true }
);
userSchema.index({ email: 1, status: 1 });
const User = mongoose.model("User", userSchema);
export default User;
