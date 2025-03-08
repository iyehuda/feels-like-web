import { celebrate } from "celebrate";
import { Router } from "express";
import UsersController from "../controllers/users";
import { idParamSchema } from "./utils";

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
 *         username:
 *           type: string
 *           description: The user name
 *       example:
 *         id: "6738b7b2944556561a86110a"
 *         email: "john@example.com"
 *         username: "john"
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
 */
userRouter.route("/:id").get(celebrate(idParamSchema), controller.getItemById.bind(controller));

export default userRouter;
