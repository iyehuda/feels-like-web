import {
  AuthResponse,
  Teardown,
  avatarPath,
  createDatabase,
  invalidId,
  nonExistentId,
  signupUser,
  testUser,
} from "./utils";
import User, { IUser } from "../src/models/user";
import { connect, disconnect } from "../src/db";
import { HydratedDocument } from "mongoose";
import { createApp } from "../src/app";
import request from "supertest";

let auth: AuthResponse;
const teardown = new Teardown();
let testUserDoc: HydratedDocument<IUser>;
const app = createApp();

beforeAll(async () => {
  const { dbConnectionString, closeDatabase } = await createDatabase();
  teardown.add(closeDatabase);

  await connect(dbConnectionString);
  teardown.add(disconnect);

  await User.deleteMany({});

  const authResponse = await signupUser(app, {
    ...testUser,
    avatar: avatarPath,
  });
  expect(authResponse.status).toBe(201);

  auth = authResponse.body;
  testUserDoc = (await User.findOne({ email: testUser.email }))!;
});

afterAll(async () => {
  await teardown.run();
});

describe("GET /users/:id", () => {
  test("should get a user by id", async () => {
    const response = await request(app)
      .get(`/users/${testUserDoc.id}`)
      .auth(auth.accessToken, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      email: testUser.email,
      fullName: testUser.fullName,
      id: testUserDoc.id,
    });
  });

  test("should return 400 if user id is invalid", async () => {
    const response = await request(app)
      .get(`/users/${invalidId}`)
      .auth(auth.accessToken, { type: "bearer" });

    expect(response.status).toBe(400);
  });

  test("should return 404 if user not found", async () => {
    const response = await request(app)
      .get(`/users/${nonExistentId}`)
      .auth(auth.accessToken, { type: "bearer" });

    expect(response.status).toBe(404);
  });
});
