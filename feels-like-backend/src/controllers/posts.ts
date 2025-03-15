import { Request, Response } from "express";
import Post, { IPost } from "../models/post";
import BaseController, { DBHandler } from "./base-controller";
import { BadRequest, Forbidden, NotFound } from "http-errors";
import { HydratedDocument } from "mongoose";
import { unlink } from "node:fs/promises";

export interface PostResponse {
  author: string;
  content: string;
  createdAt: Date;
  id: string;
  image: string;
  likedByMe: boolean;
  likes: number;
}

function postResponse(item: HydratedDocument<IPost>): PostResponse {
  return {
    author: item.author.toString(),
    content: item.content,
    createdAt: item.createdAt,
    id: item.id,
    image: item.image,
    likedByMe: false,
    likes: 0,
  };
}

async function tryRemoveFile(path: string) {
  try {
    await unlink(path);
  } catch (error) {
    console.error(`Failed to remove file ${path}: ${error}`);
  }
}

export default class PostsController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }

  @DBHandler
  async create(req: Request, res: Response) {
    const { content } = req.body;
    const { path: image } = req.file || { path: "" };
    const author = res.locals.user._id;

    if (!image) {
      throw BadRequest("Image is required");
    }

    const item = await this.model.create({
      author,
      content,
      image,
    });

    res.status(201).json(postResponse(item));
  }

  @DBHandler
  async getItems(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      const filter: any = {};

      if (req.query.author) {
        filter.author = req.query.author;
      }

      const totalPosts = await this.model.countDocuments(filter);
      const totalPages = Math.ceil(totalPosts / limit);

      const items = await this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      res.status(200).json({
        currentPage: page,
        posts: items.map(postResponse),
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching paginated posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  }

  @DBHandler
  async getItemById(req: Request, res: Response) {
    const item = await this.model.findById(req.params.id);

    if (!item) {
      throw NotFound("Item not found");
    } else {
      res.json(postResponse(item));
    }
  }

  async getMyPost(req: Request, res: Response) {
    const { id: postId } = req.params;
    const myId = res.locals.user._id;
    const item = await this.model.findById(postId);

    if (!item) {
      throw NotFound("Item not found");
    }

    if (item.author.toString() !== myId.toString()) {
      throw Forbidden("Action not allowed");
    }

    return item;
  }

  @DBHandler
  async updateItemById(req: Request, res: Response) {
    const { content } = req.body;
    const { path: image } = req.file || { path: "" };
    const item = await this.getMyPost(req, res);

    item.content = content;

    if (image) {
      await tryRemoveFile(item.image);
      item.image = image;
    }

    await item.save();
    res.json(postResponse(item));
  }

  @DBHandler
  async deleteItemById(req: Request, res: Response) {
    const item = await this.getMyPost(req, res);

    await tryRemoveFile(item.image);
    await item.deleteOne();

    res.status(204).send();
  }
}
