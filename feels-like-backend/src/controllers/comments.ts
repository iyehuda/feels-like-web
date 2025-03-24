import { Request, Response } from "express";
import Comment, { IComment } from "../models/comment";
import BaseController, { DBHandler } from "./base-controller";
import { Forbidden, NotFound } from "http-errors";

export default class CommentsController extends BaseController<IComment> {
  constructor() {
    super(Comment);
  }

  @DBHandler
  async create(req: Request, res: Response) {
    const { content, post } = req.body;
    const author = res.locals.user._id;

    const item = await this.model.create({
      author,
      content,
      post,
    });

    res.status(201).json(item);
  }

  async getMyComment(req: Request, res: Response) {
    const { id: commentId } = req.params;
    const myId = res.locals.user._id;
    const item = await this.model.findById(commentId);

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
    const item = await this.getMyComment(req, res);

    item.content = content;

    await item.save();
    res.json(item);
  }

  @DBHandler
  async deleteItemById(req: Request, res: Response) {
    const item = await this.getMyComment(req, res);

    await item.deleteOne();

    res.status(204).send();
  }

  @DBHandler
  async getItems(req: Request, res: Response) {
    const { author, post, page = 1, limit = 10 } = req.query;
    const filter: any = {};

    if (author) {
      filter.author = author;
    }

    if (post) {
      filter.post = post;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      this.model.find(filter).sort({ _id: -1 }).skip(skip).limit(Number(limit)).exec(),
      this.model.countDocuments(filter),
    ]);

    res.json({
      hasMore: skip + items.length < total,
      items,
      limit: Number(limit),
      page: Number(page),
      total,
    });
  }
}
