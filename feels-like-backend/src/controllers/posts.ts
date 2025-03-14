import { Request, Response } from "express";
import Post, { IPost } from "../models/post";
import BaseController, { DBHandler } from "./base-controller";
import { BadRequest, Forbidden, NotFound } from "http-errors";
import { HydratedDocument, RootFilterQuery } from "mongoose";
import { unlink } from "node:fs/promises";

export interface PostResponse {
  author: string;
  content: string;
  id: string;
  image: string;
  likedByMe: boolean;
  likes: number;
}

function postResponse(item: HydratedDocument<IPost>): PostResponse {
  return {
    author: item.author.toString(),
    content: item.content,
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
    const items = await this.model.find(req.query as RootFilterQuery<IPost>);

    res.json(items.map(postResponse));
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
