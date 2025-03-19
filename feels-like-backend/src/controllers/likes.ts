import { Request, Response } from "express";
import Like, { ILike } from "../models/like";
import BaseController from "./base-controller";
import { DBHandler } from "./base-controller";
import { Conflict, NotFound } from "http-errors";
import Post from "../models/post";

export default class LikesController extends BaseController<ILike> {
  constructor() {
    super(Like);
  }

  @DBHandler
  async likePost(req: Request, res: Response) {
    const { postId } = req.params;
    const userId = res.locals.user._id;

    try {
      // Create the like
      await this.model.create({
        post: postId,
        user: userId,
      });

      // Increment the likes count in the post
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

      res.status(201).json({ message: "Post liked successfully" });
    } catch (error: any) {
      if (error.code === 11000) {
        throw Conflict("You have already liked this post");
      }
      throw error;
    }
  }

  @DBHandler
  async unlikePost(req: Request, res: Response) {
    const { postId } = req.params;
    const userId = res.locals.user._id;

    const like = await this.model.findOneAndDelete({ post: postId, user: userId });

    if (!like) {
      throw NotFound("Like not found");
    }

    // Decrement the likes count in the post
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

    res.status(200).json({ message: "Post unliked successfully" });
  }

  @DBHandler
  async getLikes(req: Request, res: Response) {
    const { postId } = req.params;
    const userId = res.locals.user._id;

    const [post, userLike] = await Promise.all([
      Post.findById(postId),
      this.model.findOne({ post: postId, user: userId }),
    ]);

    if (!post) {
      throw NotFound("Post not found");
    }

    res.json({
      likes: post.likesCount,
      likedByMe: !!userLike,
    });
  }
} 