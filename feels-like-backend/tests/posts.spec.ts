import { HydratedDocument } from "mongoose";
import {
  AuthResponse,
  Teardown,
  createDatabase,
  nonExistentId,
  photoPath,
  setupDBWithUser,
} from "./utils";

import request from "supertest";

import { createApp } from "../src/app";
import { connect, disconnect } from "../src/db";
import Post, { IPost } from "../src/models/post";
import User, { IUser } from "../src/models/user";

interface PostCreationRequest {
  content: string;
  image: string;
}
interface PostResponse extends PostCreationRequest {
  id: string;
  author: string;
  likes: number;
  likedByMe: boolean;
}

const teardown = new Teardown();
const app = createApp();
const testPost: PostCreationRequest = { content: "Hello World", image: photoPath };

let authorAuth: AuthResponse;
let authorUser: HydratedDocument<IUser>;
let testPostDoc: HydratedDocument<IPost>;

function expectedPostResponse(): PostResponse {
  return {
    author: authorUser.id,
    content: testPost.content,
    id: testPostDoc.id,
    image: expect.any(String),
    likedByMe: false,
    likes: 0,
  };
}

beforeAll(async () => {
  const { dbConnectionString, closeDatabase } = await createDatabase();
  teardown.add(closeDatabase);

  await connect(dbConnectionString);
  teardown.add(disconnect);

  await Post.deleteMany({});
  await User.deleteMany({});

  const { auth, user } = await setupDBWithUser(app);

  authorAuth = auth;
  authorUser = user;
});

afterAll(async () => {
  await teardown.run();
});

beforeEach(async () => {
  testPostDoc = await Post.create({ ...testPost, author: authorUser._id, image: "not-exists.png" });
});

afterEach(async () => {
  await testPostDoc.deleteOne();
});

describe("POST /posts", () => {
  afterAll(async () => {
    await Post.deleteMany({});
  });

  test("should create a new post", async () => {
    const response = await request(app)
      .post("/posts")
      .auth(authorAuth.accessToken, { type: "bearer" })
      .field("content", testPost.content)
      .attach("image", testPost.image);
    const body = response.body as PostResponse;

    expect(response.status).toBe(201);

    const post = await Post.findById(body.id);
    expect(post).not.toBeNull();

    expect(post!.content).toBe(testPost.content);

    await post!.deleteOne();
  });

  test("should return 401 if author did not logged in", async () => {
    const response = await request(app)
      .post("/posts")
      .field("content", testPost.content)
      .attach("image", testPost.image);

    expect(response.status).toBe(401);
  });

  test("should return 400 if content is missing", async () => {
    const response = await request(app)
      .post("/posts")
      .auth(authorAuth.accessToken, { type: "bearer" })
      .attach("image", testPost.image);

    expect(response.status).toBe(400);
  });

  test("should return 400 if image is missing", async () => {
    const response = await request(app)
      .post("/posts")
      .auth(authorAuth.accessToken, { type: "bearer" })
      .field("content", testPost.content);

    expect(response.status).toBe(400);
  });
});

describe("GET /posts", () => {
  test("should get all posts", async () => {
    const response = await request(app)
      .get("/posts")
      .auth(authorAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      currentPage: 1,
      posts: [expectedPostResponse()],
      totalPages: 1,
    });
  });

  test("should get posts by author", async () => {
    const response = await request(app)
      .get(`/posts?author=${authorUser.id}`)
      .auth(authorAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      currentPage: 1,
      posts: [expectedPostResponse()],
      totalPages: 1,
    });
  });

  test("should return an empty result if no posts found", async () => {
    const response = await request(app)
      .get(`/posts?author=${nonExistentId}`)
      .auth(authorAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      currentPage: 1,
      posts: [],
      totalPages: 0,
    });
  });
});

describe("GET /posts/:id", () => {
  test("should get a post by id", async () => {
    const response = await request(app)
      .get(`/posts/${testPostDoc.id}`)
      .auth(authorAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedPostResponse());
  });

  test("should return 404 if post not found", async () => {
    const response = await request(app)
      .get(`/posts/${nonExistentId}`)
      .auth(authorAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(404);
  });
});

describe("PUT /posts/:id", () => {
  test("should update a post by id", async () => {
    const postUpdate = { content: "Updated Message" };

    const response = await request(app)
      .put(`/posts/${testPostDoc.id}`)
      .auth(authorAuth.accessToken, { type: "bearer" })
      .field("content", postUpdate.content);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ...expectedPostResponse(), ...postUpdate });
  });

  test("should return 400 if message is missing", async () => {
    const response = await request(app)
      .put(`/posts/${testPostDoc.id}`)
      .auth(authorAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(400);
  });

  test("should return 404 if post not found", async () => {
    const postUpdate = { content: "Updated Message" };

    const response = await request(app)
      .put(`/posts/${nonExistentId}`)
      .auth(authorAuth.accessToken, { type: "bearer" })
      .field("content", postUpdate.content);

    expect(response.status).toBe(404);
  });
});

describe("DELETE /posts/:id", () => {
  test("should delete a post by id", async () => {
    const response = await request(app)
      .delete(`/posts/${testPostDoc.id}`)
      .auth(authorAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(204);

    const post = await Post.findById(testPostDoc.id);
    expect(post).toBeNull();
  });

  test("should return 404 if post not found", async () => {
    const response = await request(app)
      .delete(`/posts/${nonExistentId}`)
      .auth(authorAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(404);
  });
});
