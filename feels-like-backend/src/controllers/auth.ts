import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import { refreshTokenExpires, tokenExpires, tokenSecret } from "../config";
import { Conflict, Unauthorized } from "http-errors";
import { StringValue } from "ms";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface TokenPayload {
  _id: string;
}

function createToken(userId: string, expiresIn: StringValue): string {
  const random = Math.random().toString();

  return jwt.sign({ _id: userId, random }, tokenSecret, { expiresIn });
}

async function generateTokens(user: HydratedDocument<IUser>): Promise<Tokens> {
  const accessToken = createToken(user.id, tokenExpires);
  const refreshToken = createToken(user.id, refreshTokenExpires);

  user.refreshTokens.push(refreshToken);
  await user.save();

  return {
    accessToken,
    refreshToken,
  };
}

async function hashPassword(password: string): Promise<string> {
  const SALT_ROUNDS = 10;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);

  return await bcrypt.hash(password, salt);
}

async function getUserByEmailAndPassword(
  email: string,
  password: string,
): Promise<HydratedDocument<IUser>> {
  const unauthorized = Unauthorized("Invalid username or password");

  const user = await User.findOne({ email });
  if (!user) {
    throw unauthorized;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw unauthorized;
  }

  return user;
}

async function getUserByToken(token: string): Promise<HydratedDocument<IUser>> {
  const { _id: userId } = jwt.verify(token, tokenSecret) as TokenPayload;
  const user = await User.findById(userId);

  if (!user) {
    throw new Error(`User not found for id ${userId}`);
  }

  return user;
}

async function getUserByRefreshToken(refreshToken: string): Promise<HydratedDocument<IUser>> {
  const user = await getUserByToken(refreshToken);

  if (!user.refreshTokens.includes(refreshToken)) {
    user.refreshTokens = [];
    await user.save();

    throw new Error(`User ${user.id} does not have refresh token ${refreshToken}`);
  }

  return user;
}

export async function signup(req: Request, res: Response) {
  const { email, password, username } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw Conflict("Email already in use");
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    email,
    password: hashedPassword,
    username,
  });
  const tokens = await generateTokens(user);

  res.status(201).send({
    userId: user._id,
    ...tokens,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await getUserByEmailAndPassword(email, password);
  const tokens = await generateTokens(user);

  res.status(200).send({
    userId: user._id,
    ...tokens,
  });
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;
  try {
    const user = await getUserByRefreshToken(refreshToken);
    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
    await user.save();
    res.status(200).send("success");
  } catch (err) {
    console.error("Failed to verify refresh token", err);
    throw Unauthorized("Invalid refresh token");
  }
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;

  try {
    const user = await getUserByRefreshToken(refreshToken);
    const tokens = await generateTokens(user);

    res.status(200).send({
      userId: user._id,
      ...tokens,
    });
  } catch (err) {
    console.error("Failed to verify refresh token", err);
    throw Unauthorized("Invalid refresh token");
  }
}

export function active(req: Request, res: Response) {
  const user = res.locals.user as HydratedDocument<IUser>;

  res.status(200).send({
    userId: user.id,
  });
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header("authorization");
  const token = authorization?.split(" ")[1];

  if (!token) {
    throw Unauthorized("Token is required");
  }

  try {
    res.locals.user = await getUserByToken(token);
  } catch (err) {
    console.error("Failed to verify access token", err);
    throw Unauthorized("Access Denied");
  }

  next();
}
