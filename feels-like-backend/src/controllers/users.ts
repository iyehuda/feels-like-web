import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import BaseController, { DBHandler } from "./base-controller";
import { Forbidden, NotFound } from "http-errors";
import { tryRemoveFile } from "../utils/upload";

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

  @DBHandler
  async updateProfile(req: Request, res: Response) {
    const { fullName } = req.body;
    const { path: avatar } = req.file || { path: "" };
    const userId = req.params.id;
    const currentUserId = res.locals.user._id;

    // Only allow users to update their own profile
    if (userId !== currentUserId.toString()) {
      throw Forbidden("Not authorized to update this user");
    }

    const user = await this.model.findById(userId);
    if (!user) {
      throw NotFound("User not found");
    }

    user.fullName = fullName;

    if (avatar) {
      await tryRemoveFile(user.avatar);
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      avatar: user.avatar,
      email: user.email,
      fullName: user.fullName,
      id: user.id,
    });
  }
}
