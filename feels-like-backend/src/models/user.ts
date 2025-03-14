import mongoose, { Document, Schema } from "mongoose";
import { commonSchemaOptions } from "./utils";

export interface IUser extends Document {
  _id: string;
  avatar: string;
  email: string;
  password: string;
  refreshTokens: string[];
  fullName: string;
}

const userSchema = new Schema<IUser>(
  {
    avatar: { required: true, type: String },
    email: { required: true, type: String, unique: [true, "email is already taken"] },
    fullName: { required: true, type: String },
    password: { type: String },
    refreshTokens: { default: [], type: [String] },
  },
  commonSchemaOptions<IUser>(),
);

export default mongoose.model<IUser>("Users", userSchema);
