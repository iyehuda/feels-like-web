import { createApp } from "../src/app";
import { connect, disconnect } from "../src/db";
import Comment, { IComment } from "../src/models/comment";
import Post, { IPost } from "../src/models/post";
import User, { IUser } from "../src/models/user";
import { HydratedDocument } from "mongoose";
import { AuthResponse, Teardown, createDatabase, nonExistentId, setupDBWithUsers } from "./utils";
import request from "supertest";

interface CommentCreationRequest {
  content: string;
  post: string;
}

interface CommentResponse extends CommentCreationRequest {
  author: string;
  id: string;
}

const teardown = new Teardown();
const app = createApp();

const testComment = { content: "Hi :)" };
let authorUser: HydratedDocument<IUser>;
let commenterAuth: AuthResponse;
let commenterUser: HydratedDocument<IUser>;
let testPostDoc: HydratedDocument<IPost>;
let testCommentDoc: HydratedDocument<IComment>;

function expectedCommentResponse(): CommentResponse {
  return {
    ...testComment,
    author: commenterUser.id,
    id: expect.any(String),
    post: testPostDoc.id,
  };
}

beforeAll(async () => {
  const { dbConnectionString, closeDatabase } = await createDatabase();
  teardown.add(closeDatabase);

  await connect(dbConnectionString);
  teardown.add(disconnect);

  await Comment.deleteMany({});
  await Post.deleteMany({});
  await User.deleteMany({});

  const { auth2, user, user2 } = await setupDBWithUsers(app);

  authorUser = user;
  commenterAuth = auth2;
  commenterUser = user2;
});

afterAll(async () => {
  await teardown.run();
});

beforeEach(async () => {
  testPostDoc = await Post.create({
    author: authorUser._id,
    content: "Hello World",
    image: "not-exists.png",
  });
  testCommentDoc = await Comment.create({
    author: commenterUser._id,
    content: "Hi :)",
    post: testPostDoc._id,
  });
});

afterEach(async () => {
  await testCommentDoc.deleteOne();
  await testPostDoc.deleteOne();
});

describe("POST /comments", () => {
  afterAll(async () => {
    await Comment.deleteMany({});
  });

  test("should create a new comment", async () => {
    const response = await request(app)
      .post("/comments")
      .auth(commenterAuth.accessToken, { type: "bearer" })
      .send({ content: testComment.content, post: testPostDoc.id });
    const body = response.body as CommentResponse;

    expect(response.status).toBe(201);

    const comment = await Comment.findById(body.id);
    expect(comment).not.toBeNull();
    expect(body).toMatchObject(expectedCommentResponse());
  });

  test("should return 404 if post does not exist", async () => {
    const response = await request(app)
      .post("/comments")
      .auth(commenterAuth.accessToken, { type: "bearer" })
      .send({ content: testComment.content, post: nonExistentId });

    expect(response.status).toBe(404);
  });

  test("should return 400 if content or post is missing", async () => {
    const noContentResponse = await request(app)
      .post("/comments")
      .auth(commenterAuth.accessToken, { type: "bearer" })
      .send({ post: testPostDoc.id });
    const noPostResponse = await request(app)
      .post("/comments")
      .auth(commenterAuth.accessToken, { type: "bearer" })
      .send({ content: testComment.content });

    expect(noContentResponse.status).toBe(400);
    expect(noPostResponse.status).toBe(400);
  });
});

describe("GET /comments", () => {
  test("should get all comments", async () => {
    const response = await request(app)
      .get("/comments")
      .auth(commenterAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      hasMore: false,
      items: [expectedCommentResponse()],
      limit: 10,
      page: 1,
      total: 1,
    });
  });

  test("should get comments by author", async () => {
    const response = await request(app)
      .get(`/comments?author=${commenterUser.id}`)
      .auth(commenterAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      hasMore: false,
      items: [expectedCommentResponse()],
      limit: 10,
      page: 1,
      total: 1,
    });
  });

  test("should return an empty result if no comments found", async () => {
    const response = await request(app)
      .get(`/comments?author=${nonExistentId}`)
      .auth(commenterAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      hasMore: false,
      items: [],
      limit: 10,
      page: 1,
      total: 0,
    });
  });
});

describe("GET /comments/:id", () => {
  test("should get a comment by id", async () => {
    const response = await request(app)
      .get(`/comments/${testCommentDoc.id}`)
      .auth(commenterAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(testComment);
  });

  test("should return 404 if comment not found", async () => {
    const response = await request(app)
      .get(`/comments/${nonExistentId}`)
      .auth(commenterAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(404);
  });
});

describe("PUT /comments/:id", () => {
  test("should update a comment by id", async () => {
    const commentUpdate = { content: "Updated Message" };

    const response = await request(app)
      .put(`/comments/${testCommentDoc.id}`)
      .auth(commenterAuth.accessToken, { type: "bearer" })
      .send(commentUpdate);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ ...expectedCommentResponse(), ...commentUpdate });
  });

  test("should return 400 if message is missing", async () => {
    const emptyCommentUpdate = {};

    const response = await request(app)
      .put(`/comments/${testCommentDoc.id}`)
      .auth(commenterAuth.accessToken, { type: "bearer" })
      .send(emptyCommentUpdate);

    expect(response.status).toBe(400);
  });

  test("should return 404 if comment not found", async () => {
    const commentUpdate = { content: "Updated Message" };

    const response = await request(app)
      .put(`/comments/${nonExistentId}`)
      .auth(commenterAuth.accessToken, { type: "bearer" })
      .send(commentUpdate);

    expect(response.status).toBe(404);
  });
});

describe("DELETE /comments/:id", () => {
  test("should delete a comment by id", async () => {
    const response = await request(app)
      .delete(`/comments/${testCommentDoc.id}`)
      .auth(commenterAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(204);

    const comment = await Comment.findById(testCommentDoc.id);
    expect(comment).toBeNull();
  });

  test("should return 404 if comment not found", async () => {
    const response = await request(app)
      .delete(`/comments/${nonExistentId}`)
      .auth(commenterAuth.accessToken, { type: "bearer" });

    expect(response.status).toBe(404);
  });
});
