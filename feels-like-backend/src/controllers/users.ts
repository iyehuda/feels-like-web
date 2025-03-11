import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import BaseController, { DBHandler } from "./base-controller";
import { NotFound } from "http-errors";

export default class UsersController extends BaseController<IUser> {
  constructor() {
    super(User);
  }

  @DBHandler
  async getItemById(req: Request, res: Response) {
    const item = await this.model.findById(req.params.id);

    if (!item) {
      throw NotFound("Item not found");
    } else {
      res.json({
        avatar: item.avatar,
        email: item.email,
        fullName: item.fullName,
        id: item.id,
      });
    }
  }
}
