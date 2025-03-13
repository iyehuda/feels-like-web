import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { Express } from "express";
import User, { IUser } from "../src/models/user";
import { HydratedDocument } from "mongoose";

export type AuthResponse = { userId: string; accessToken: string; refreshToken: string };
export type TeardownFn = () => Promise<void>;
export type UserDetails = {
  email: string;
  fullName: string;
  password: string;
};
export type UserSignupRequest = UserDetails & {
  avatar: string;
};

export class Teardown {
  private teardownFns: TeardownFn[] = [];

  add(fn: TeardownFn) {
    this.teardownFns.push(fn);
  }

  async run() {
    await Promise.all(this.teardownFns.map((fn) => fn()));
  }
}

export interface DBConfig {
  dbConnectionString: string;
  closeDatabase: TeardownFn;
}

export async function createDatabase(): Promise<DBConfig> {
  const mongoServer = await MongoMemoryServer.create();
  console.log(`MongoDB URI: ${mongoServer.getUri()}`);

  return {
    closeDatabase: async () => {
      await mongoServer.stop();
    },
    dbConnectionString: mongoServer.getUri(),
  };
}

export const invalidId = "1234";
export const nonExistentId = "999999999999999999999999";
export const avatarPath = "tests/fixtures/avatar.png";
export const photoPath = "tests/fixtures/photo.png";
export const testUser: UserDetails = {
  email: "jane@example.com",
  fullName: "Jane Doe",
  password: "password123",
};
export const testUser2: UserDetails = {
  email: "john@example.com",
  fullName: "John Doe",
  password: "password1234",
};

export function signupUser(app: Express, user: UserSignupRequest) {
  return request(app)
    .post("/auth/signup")
    .field("email", user.email)
    .field("fullName", user.fullName)
    .field("password", user.password)
    .attach("avatar", avatarPath);
}

export async function setupDBWithUser(
  app: Express,
  userDetails: UserDetails = testUser,
): Promise<{ auth: AuthResponse; user: HydratedDocument<IUser> }> {
  const authResponse = await signupUser(app, {
    ...userDetails,
    avatar: avatarPath,
  });
  expect(authResponse.status).toBe(201);

  const auth: AuthResponse = authResponse.body;
  const userDoc = await User.findOne({ email: userDetails.email });

  expect(userDoc).not.toBeNull();

  return { auth, user: userDoc! };
}

export async function setupDBWithUsers(app: Express): Promise<{
  auth: AuthResponse;
  auth2: AuthResponse;
  user: HydratedDocument<IUser>;
  user2: HydratedDocument<IUser>;
}> {
  const { auth, user } = await setupDBWithUser(app, testUser);
  const { auth: auth2, user: user2 } = await setupDBWithUser(app, testUser2);

  return { auth, auth2, user, user2 };
}
