import mongoose, { Document, Schema } from "mongoose";
import { commonSchemaOptions } from "./utils";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  refreshTokens: string[];
  username: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { required: true, type: String, unique: [true, "email is already taken"] },
    password: { required: true, type: String },
    refreshTokens: { default: [], type: [String] },
    username: { required: true, type: String },
  },
  commonSchemaOptions<IUser>(),
);

export default mongoose.model<IUser>("Users", userSchema);
