import { Segments, celebrate } from "celebrate";
import Joi from "joi";
import * as authController from "../controllers/auth";
import express from "express";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Authentication API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - avatar
 *       properties:
 *         username:
 *           type: string
 *           description: The user username
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         #avatar:
 *         #  type: string
 *         #  format: binary
 *         #  description: User avatar file
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         email: 'bob@gmail.com'
 *         password: '123456'
 *
 *     AuthResponse:
 *       type: object
 *       required:
 *       - userId
 *       - accessToken
 *       - refreshToken
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID
 *         accessToken:
 *           type: string
 *           description: The access token
 *         refreshToken:
 *           type: string
 *           description: The refresh token
 *       example:
 *         userId: 60d0fe4f5311236168a109ca
 *         accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     RefreshOrLogoutRequest:
 *       type: object
 *       required:
 *       - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: The refresh token
 *       example:
 *         refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Signs up a new user
 *     tags: [Auth]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       200:
 *         description: The user id and auth tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid request
 *       409:
 *         description: Email already exist
 */
const signupRequestSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
  }),
};
authRouter.post("/signup", celebrate(signupRequestSchema), authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and return tokens
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: The user id and auth tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Invalid credentials
 */
const loginRequestSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
authRouter.post("/login", celebrate(loginRequestSchema), authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh auth tokens
 *     description: Create bew access and refresh tokens using the current refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshOrLogoutRequest'
 *     responses:
 *       200:
 *         description: The user id and new auth tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Invalid refresh token
 */
const refreshRequestSchema = {
  [Segments.BODY]: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};
authRouter.post("/refresh", celebrate(refreshRequestSchema), authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user and invalidate the refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshOrLogoutRequest'
 *     responses:
 *       200:
 *         description: Successful logout
 *       401:
 *         description: Invalid refresh token
 */
const logoutRequestSchema = {
  [Segments.BODY]: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};
authRouter.post("/logout", celebrate(logoutRequestSchema), authController.logout);

/**
 * @swagger
 * /auth/active:
 *   get:
 *     summary: Check for active auth token
 *     description: Check if the access token is active
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Access token is active
 *       401:
 *         description: Invalid access token
 */
authRouter.get("/active", authController.authMiddleware, authController.active);

export default authRouter;
