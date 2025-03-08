import { AuthResponse, Teardown, avatarPath, createDatabase, signupUser, testUser } from "./utils";
import User from "../src/models/user";
import { connect, disconnect } from "../src/db";
import { createApp } from "../src/app";
import request from "supertest";

let auth: AuthResponse;
let teardown: Teardown;
const app = createApp();

beforeAll(async () => {
  const { dbConnectionString, closeDatabase } = await createDatabase();
  teardown = closeDatabase;

  await connect(dbConnectionString);
  await User.deleteMany({});
});

afterAll(async () => {
  await disconnect();
  await teardown();
});

function expectAuthResponse(response: object) {
  expect(response).toMatchObject({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    userId: expect.any(String),
  });
}

describe("POST /auth/signup", () => {
  test("should create a new user", async () => {
    const response = await signupUser(app, {
      ...testUser,
      avatar: avatarPath,
    });
    expect(response.status).toBe(201);

    expectAuthResponse(response.body);

    auth = response.body;
  });

  test("should provide valid access token", async () => {
    const response = await request(app)
      .get("/auth/active")
      .auth(auth.accessToken, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ userId: auth.userId });
  });

  test("should fail on email conflict", async () => {
    const response = await signupUser(app, {
      ...testUser,
      avatar: avatarPath,
    });
    expect(response.status).toBe(409);
  });
});

describe("POST /auth/login", () => {
  test("should login user", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toBe(200);
    expectAuthResponse(response.body);

    auth = response.body;
  });

  test("should provide valid access token", async () => {
    const response = await request(app)
      .get("/auth/active")
      .auth(auth.accessToken, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ userId: auth.userId });
  });

  test("should fail on invalid credentials", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "invalid",
    });
    expect(response.status).toBe(401);
  });
});

describe("POST /auth/refresh", () => {
  test("should refresh tokens", async () => {
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: auth.refreshToken,
    });

    expect(response.status).toBe(200);
    expectAuthResponse(response.body);

    // eslint-disable-next-line require-atomic-updates
    auth = response.body;
  });

  test("should provide valid access token", async () => {
    const response = await request(app)
      .get("/auth/active")
      .auth(auth.accessToken, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ userId: auth.userId });
  });

  test("should fail on invalid refresh token", async () => {
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: "invalid",
    });
    expect(response.status).toBe(401);
  });
});

describe("POST /auth/logout", () => {
  test("should logout user", async () => {
    const response = await request(app).post("/auth/logout").send({
      refreshToken: auth.refreshToken,
    });
    expect(response.status).toBe(200);
  });

  test("should revoke refresh token", async () => {
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: auth.refreshToken,
    });

    expect(response.status).toBe(401);
  });

  test("should fail on invalid refresh token", async () => {
    const response = await request(app).post("/auth/logout").send({
      refreshToken: "invalid",
    });
    expect(response.status).toBe(401);
  });

  test("should fail on missing refresh token", async () => {
    const response = await request(app).post("/auth/logout");
    expect(response.status).toBe(400);
  });
});
