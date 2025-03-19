import { Document, Schema, model } from "mongoose";
import User from "./user";
import { commonSchemaOptions } from "./utils";
import { NotFound } from "http-errors";

export interface IPost extends Document {
  author: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  image: string;
}

const postSchema = new Schema<IPost>(
  {
    author: { required: true, type: Schema.Types.ObjectId },
    content: { required: true, type: String },
    createdAt: { default: Date.now, type: Date },
    image: { required: true, type: String },
  },
  commonSchemaOptions<IPost>(),
);

postSchema.pre("save", async function checkAuthorExists() {
  if (!(await User.findById(this.author))) {
    throw NotFound(`User "${this.author}" not found`);
  }
});

export default model("Post", postSchema);
