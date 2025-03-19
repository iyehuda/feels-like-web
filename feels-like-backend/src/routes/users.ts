import { celebrate, Segments } from "celebrate";
import { Router } from "express";
import UsersController from "../controllers/users";
import { idParamSchema } from "./utils";
import Joi from "joi";
import upload from "../utils/upload";

const userRouter = Router();
const controller = new UsersController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         email:
 *           type: string
 *           description: The user email
 *         fullName:
 *           type: string
 *           description: The user name
 *       example:
 *         id: "6738b7b2944556561a86110a"
 *         email: "john@example.com"
 *         fullName: "john"
 */

/**
 * @swagger
 * /users/{id}:
 *   parameters:
 *   - in: path
 *     name: id
 *     required: true
 *     schema:
 *       type: string
 *     description: The user ID
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: The user was not found
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The user's full name
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: The user's avatar image
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Not authorized to update this user
 *       404:
 *         description: The user was not found
 */
const updateProfileSchema = {
  [Segments.BODY]: Joi.object({
    fullName: Joi.string().required(),
  }),
};

userRouter
  .route("/:id")
  .get(celebrate(idParamSchema), controller.getItemById.bind(controller))
  .put(
    celebrate(idParamSchema),
    upload.single("avatar"),
    celebrate(updateProfileSchema),
    controller.updateProfile.bind(controller)
  );

export default userRouter;
