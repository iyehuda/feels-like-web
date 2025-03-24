import { Document, Schema, model } from "mongoose";
import Post from "./post";
import User from "./user";
import { commonSchemaOptions } from "./utils";
import { NotFound } from "http-errors";

export interface ILike extends Document {
  post: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    createdAt: { default: Date.now, type: Date },
    post: { ref: "Post", required: true, type: Schema.Types.ObjectId },
    user: { ref: "User", required: true, type: Schema.Types.ObjectId },
  },
  commonSchemaOptions<ILike>(),
);

// Create a compound unique index to prevent duplicate likes
likeSchema.index({ post: 1, user: 1 }, { unique: true });

// Validate that both post and user exist
likeSchema.pre("save", async function checkPostAndUserExist() {
  if (!(await Post.findById(this.post))) {
    throw NotFound(`Post "${this.post}" not found`);
  }

  if (!(await User.findById(this.user))) {
    throw NotFound(`User "${this.user}" not found`);
  }
});

export default model("Like", likeSchema);
