import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { Express } from "express";

export type AuthResponse = { userId: string; accessToken: string; refreshToken: string };
export type Teardown = () => Promise<void>;

export interface DBConfig {
  dbConnectionString: string;
  closeDatabase: Teardown;
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
export const testUser = {
  email: "jane@example.com",
  fullName: "Jane Doe",
  password: "password123",
};

type UserSignupRequest = {
  email: string;
  fullName: string;
  password: string;
  avatar: string;
};

export function signupUser(app: Express, user: UserSignupRequest) {
  return request(app)
    .post("/auth/signup")
    .field("email", user.email)
    .field("fullName", user.fullName)
    .field("password", user.password)
    .attach("avatar", avatarPath);
}
