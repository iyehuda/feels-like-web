import { Segments, celebrate } from "celebrate";
import { idParamSchema, validObjectId } from "./utils";
import CommentsController from "../controllers/comments";
import Joi from "joi";
import { Router } from "express";

const commentRouter = Router();
const controller = new CommentsController();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateComment:
 *       type: object
 *       required:
 *       - content
 *       - post
 *       properties:
 *         content:
 *           type: string
 *           description: The comment message content
 *         post:
 *           type: string
 *           description: The post ID this comment belongs to
 *       example:
 *         content: "This is a great post!"
 *         post: "678978cff1f71e3b0dd7bb45"
 *
 *     UpdateComment:
 *       type: object
 *       required:
 *       - content
 *       properties:
 *         content:
 *           type: string
 *           description: The new comment message content
 *       example:
 *         content: "This is a wonderful post! (updated)"
 *
 *     CommentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The comment ID
 *         author:
 *           type: string
 *           description: The author user ID
 *         content:
 *           type: string
 *           description: The comment message content
 *         post:
 *           type: string
 *           description: The post ID this comment belongs to
 *       example:
 *         id: "678978cff1f71e3b0dd7bb45"
 *         author: "6739b7b2944556561a86110a"
 *         content: "This is a great post!"
 *         post: "679912cff1f71e3b0dd7bb45"
 */
const newCommentSchema = {
  [Segments.BODY]: Joi.object({
    content: Joi.string().required(),
    post: Joi.string().custom(validObjectId).required(),
  }),
};
const getCommentsSchema = {
  [Segments.QUERY]: Joi.object({
    author: Joi.string().custom(validObjectId).optional(),
    limit: Joi.number().min(1).max(50).optional().default(10),
    page: Joi.number().min(1).optional().default(1),
    post: Joi.string().custom(validObjectId).optional(),
  }),
};
const updateCommentSchema = {
  [Segments.BODY]: Joi.object({
    content: Joi.string().required(),
  }),
};

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get paginated comments with optional filtering by author or post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter comments by author
 *       - in: query
 *         name: post
 *         schema:
 *           type: string
 *         description: Filter comments by post
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A paginated list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CommentResponse'
 *                 total:
 *                   type: integer
 *                   description: Total number of comments matching the filter
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Number of items per page
 *                 hasMore:
 *                   type: boolean
 *                   description: Whether there are more comments to load
 *       400:
 *         description: Invalid filters or pagination parameters
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateComment'
 *     responses:
 *       201:
 *         description: The newly created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       400:
 *         description: Invalid comment data (e.g. missing fields, invalid author ID)
 *       404:
 *         description: Post not found
 */
commentRouter
  .route("/")
  .get(celebrate(getCommentsSchema), controller.getItems.bind(controller))
  .post(celebrate(newCommentSchema), controller.create.bind(controller));

/**
 * @swagger
 * /comments/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The comment ID
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The requested comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       404:
 *         description: The comment was not found
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateComment'
 *     responses:
 *       200:
 *         description: The updated comment
 *         content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentResponse'
 *       400:
 *         description: Invalid comment ID or update details
 *       403:
 *         description: The comment was not created by the current user
 *       404:
 *         description: The comment was not found
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: The comment was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       403:
 *         description: The comment was not created by the current user
 *       404:
 *         description: The comment was not found
 */
commentRouter
  .route("/:id")
  .all(celebrate(idParamSchema))
  .get(controller.getItemById.bind(controller))
  .put(celebrate(updateCommentSchema), controller.updateItemById.bind(controller))
  .delete(controller.deleteItemById.bind(controller));

export default commentRouter;
