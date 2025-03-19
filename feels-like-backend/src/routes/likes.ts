import { celebrate, Segments } from "celebrate";
import { validObjectId } from "./utils";
import LikesController from "../controllers/likes";
import { Router } from "express";
import Joi from "joi";

const likeRouter = Router();
const controller = new LikesController();

const postIdParamSchema = {
  [Segments.PARAMS]: Joi.object({ postId: Joi.string().required().custom(validObjectId) }),
};

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Post likes management
 */

/**
 * @swagger
 * /posts/{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to like
 *     responses:
 *       201:
 *         description: Post liked successfully
 *       400:
 *         description: Invalid post ID
 *       409:
 *         description: You have already liked this post
 *       404:
 *         description: Post not found
 */
likeRouter.post(
  "/:postId/like",
  celebrate(postIdParamSchema),
  controller.likePost.bind(controller)
);

/**
 * @swagger
 * /posts/{postId}/unlike:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to unlike
 *     responses:
 *       204:
 *         description: Post unliked successfully
 *       400:
 *         description: Invalid post ID
 *       404:
 *         description: Like not found
 */
likeRouter.delete(
  "/:postId/unlike",
  celebrate(postIdParamSchema),
  controller.unlikePost.bind(controller)
);

/**
 * @swagger
 * /posts/{postId}/likes:
 *   get:
 *     summary: Get post likes count and current user's like status
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to get likes for
 *     responses:
 *       200:
 *         description: Post likes information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: number
 *                   description: Total number of likes
 *                 likedByMe:
 *                   type: boolean
 *                   description: Whether the current user has liked the post
 *       400:
 *         description: Invalid post ID
 *       404:
 *         description: Post not found
 */
likeRouter.get(
  "/:postId/likes",
  celebrate(postIdParamSchema),
  controller.getLikes.bind(controller)
);

export default likeRouter; 