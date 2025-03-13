import { Document, Schema, model } from "mongoose";
import Post from "./post";
import User from "./user";
import { commonSchemaOptions } from "./utils";
import { NotFound } from "http-errors";

export interface IComment extends Document {
  post: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>(
  {
    author: { ref: "User", required: true, type: Schema.Types.ObjectId },
    content: { required: true, type: String },
    post: { ref: "Post", required: true, type: Schema.Types.ObjectId },
  },
  commonSchemaOptions<IComment>(),
);

commentSchema.pre("save", async function checkAuthorAndPostExist() {
  if (!(await User.findById(this.author))) {
    throw NotFound(`User "${this.author}" not found`);
  }

  if (!(await Post.findById(this.post))) {
    throw NotFound(`Post "${this.post}" not found`);
  }
});

export default model("Comment", commentSchema);
