import { Model, MongooseError, RootFilterQuery } from "mongoose";
import { Request, Response } from "express";
import { MongoServerError } from "mongodb";
import { Conflict, NotFound } from "http-errors";

type ControllerMethod = (req: Request, res: Response) => Promise<void>;

type WrappedMongooseError = MongooseError & { cause: MongoServerError };
export const DuplicateKeyErrorCode = 11000;

function handleDBError(error: unknown) {
  if (!(error instanceof MongooseError)) {
    throw error;
  }

  switch ((error as WrappedMongooseError).cause.code) {
    case DuplicateKeyErrorCode:
      throw Conflict(error.message);
    default:
      throw error;
  }
}

export function DBHandler<T>(target: ControllerMethod, context: ClassMethodDecoratorContext) {
  if (context.kind !== "method") {
    throw new Error("DBHandler can only be applied to methods");
  }

  return async function wrapWithDBHandling(this: T, req: Request, res: Response) {
    try {
      await target.apply(this, [req, res]);
    } catch (error) {
      handleDBError(error);
    }
  };
}

export default class BaseController<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  @DBHandler
  async create(req: Request, res: Response) {
    req.body = { ...(req.body as Record<string, unknown>), author: req.params.userId };
    const item = await this.model.create(req.body);

    res.status(201).json(item);
  }

  @DBHandler
  async getItems(req: Request, res: Response) {
    const items = await this.model.find(req.query as RootFilterQuery<T>);

    res.json(items);
  }

  @DBHandler
  async getItemById(req: Request, res: Response) {
    const item = await this.model.findById(req.params.id);

    if (!item) {
      throw NotFound("Item not found");
    } else {
      res.json(item);
    }
  }

  @DBHandler
  async updateItemById(req: Request, res: Response) {
    const item = await this.model.findById(req.params.id);

    if (!item) {
      throw NotFound("Item not found");
    } else {
      Object.assign(item, req.body);
      await item.save();
      res.json(item);
    }
  }

  @DBHandler
  async deleteItemById(req: Request, res: Response) {
    const item = await this.model.findByIdAndDelete(req.params.id);

    if (!item) {
      throw NotFound("Item not found");
    } else {
      res.status(204).send();
    }
  }
}
