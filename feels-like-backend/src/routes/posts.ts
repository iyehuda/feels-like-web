import { Segments, celebrate } from "celebrate";
import { idParamSchema, validObjectId } from "./utils";
import Joi from "joi";
import PostsController from "../controllers/posts";
import { Router } from "express";
import upload from "../utils/upload";

const postRouter = Router();
const controller = new PostsController();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePost:
 *       type: object
 *       required:
 *       - content
 *       - image
 *       properties:
 *         content:
 *           type: string
 *           description: The post message content
 *         image:
 *           type: string
 *           format: binary
 *           description: The post image
 *
 *     UpdatePost:
 *       type: object
 *       required:
 *       - content
 *       properties:
 *         content:
 *           type: string
 *           description: The post new message content
 *         image:
 *           type: string
 *           format: binary
 *           description: The post new image
 *
 *     PostResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The post ID
 *         author:
 *           type: string
 *           description: The post author user ID
 *         content:
 *           type: string
 *           description: The post content
 *         image:
 *           type: string
 *           description: The post image relative path
 *         likedByMe:
 *           type: boolean
 *           description: Whether the post is liked by the current user
 *         likes:
 *           type: number
 *           description: The number of likes the post has
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the post was created
 *       example:
 *         id: "678978cff1f71e3b0dd7bb45"
 *         author: "6738b7b2944556561a86110a"
 *         content: "Hello, world!"
 *         image: "uploads/678978cff1f71e3b0dd7bb45.jpg"
 *         likedByMe: false
 *         likes: 0
 *         createdAt: "2024-03-15T12:00:00Z"
 */

const newPostSchema = {
  [Segments.BODY]: Joi.object({
    content: Joi.string().required(),
  }),
};
const getPostsSchema = {
  [Segments.QUERY]: Joi.object({
    author: Joi.string().custom(validObjectId).optional(),
    limit: Joi.number().integer().min(1).max(50).optional(),
    page: Joi.number().integer().min(1).optional(),
  }),
};
const updatePostSchema = {
  [Segments.BODY]: Joi.object({
    content: Joi.string().required(),
  }),
};

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get posts with optional filtering by author and pagination
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter posts by author
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: The page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of posts per page (default is 10)
 *     responses:
 *       200:
 *         description: A paginated list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PostResponse'
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *       400:
 *         description: Invalid filters
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreatePost'
 *     responses:
 *       201:
 *         description: The newly created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       400:
 *         description: Invalid post data (e.g. missing fields, invalid author ID)
 */
postRouter
  .route("/")
  .get(celebrate(getPostsSchema), controller.getItems.bind(controller))
  .post(upload.single("image"), celebrate(newPostSchema), controller.create.bind(controller));

/**
 * @swagger
 * /posts/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The post ID
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       404:
 *         description: The post was not found
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePost'
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       403:
 *         description: The post was not created by the current user
 *       404:
 *         description: The post was not found
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: The post was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       403:
 *         description: The post was not created by the current user
 *       404:
 *         description: The post was not found
 */
postRouter
  .route("/:id")
  .all(celebrate(idParamSchema))
  .get(controller.getItemById.bind(controller))
  .put(
    upload.single("image"),
    celebrate(updatePostSchema),
    controller.updateItemById.bind(controller),
  )
  .delete(controller.deleteItemById.bind(controller));

export default postRouter;
