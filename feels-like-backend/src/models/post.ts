import { Document, Schema, model } from "mongoose";
import User from "./user";
import { commonSchemaOptions } from "./utils";
import { NotFound } from "http-errors";

export interface IPost extends Document {
  author: Schema.Types.ObjectId;
  content: string;
  image: string;
  likes: number;
}

const postSchema = new Schema<IPost>(
  {
    author: { required: true, type: Schema.Types.ObjectId },
    content: { required: true, type: String },
    image: { required: true, type: String },
    likes: { default: 0, type: Number },
  },
  commonSchemaOptions<IPost>(),
);

postSchema.pre("save", async function checkAuthorExists() {
  if (!(await User.findById(this.author))) {
    throw NotFound(`User "${this.author}" not found`);
  }
});

export default model("Post", postSchema);
