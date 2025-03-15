import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import { googleClientId, refreshTokenExpires, tokenExpires, tokenSecret } from "../config";
import { BadRequest, Conflict, Unauthorized } from "http-errors";
import { StringValue } from "ms";
import { OAuth2Client, TokenPayload as GoogleToken } from "google-auth-library";
import download from "image-downloader";
import { getFilePath } from "../utils/upload";
import path from "path";

const googleClient = new OAuth2Client();

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
  const unauthorized = Unauthorized("Invalid email or password");

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

  user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
  await user.save();

  return user;
}

// eslint-disable-next-line max-statements
export async function signup(req: Request, res: Response) {
  const { email, password, fullName } = req.body;
  const { path: avatar } = req.file || { path: "" };

  if (!avatar) {
    throw BadRequest("Avatar is required");
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw Conflict("Email already in use");
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    avatar,
    email,
    fullName,
    password: hashedPassword,
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

async function downloadAvatar(url: string): Promise<string> {
  const filename = getFilePath();
  const fullPath = path.join(process.cwd(), filename);
  await download.image({ dest: fullPath, url });

  return filename;
}

async function createUserFromGoogle(token: GoogleToken): Promise<HydratedDocument<IUser>> {
  const { email, name: fullName, picture } = token;
  const avatar = await downloadAvatar(picture!);

  return User.create({
    avatar,
    email: email!,
    fullName,
  });
}

async function getOrCreateUserFromGoogle(token: GoogleToken): Promise<HydratedDocument<IUser>> {
  const { email } = token;

  let user = await User.findOne({ email });

  if (!user) {
    user = await createUserFromGoogle(token);
  }

  return user;
}

export async function googleSignin(req: Request, res: Response) {
  const { credential } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      audience: googleClientId,
      idToken: credential,
    });
    const payload = ticket.getPayload();
    const user = await getOrCreateUserFromGoogle(payload!);
    const tokens = await generateTokens(user);

    res.status(200).send({
      userId: user._id,
      ...tokens,
    });
  } catch (err) {
    throw Unauthorized((err as Error).message);
  }
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;
  try {
    await getUserByRefreshToken(refreshToken);

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
