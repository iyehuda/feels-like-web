import { Segments, celebrate } from "celebrate";
import Joi from "joi";
import { Router } from "express";
import HelloWorldController from "../controllers/hello-world-controller";

const helloWorldRouter = Router();
const controller = new HelloWorldController();

/**
 * @swagger
 * tags:
 *   name: Hello World
 *   description: Dummy routes
 */
const getMessageSchema = {
  [Segments.QUERY]: Joi.object({}),
};
const getVersionSchema = {
  [Segments.QUERY]: Joi.object({}),
};

/**
 * @swagger
 * /hello/world:
 *   get:
 *     summary: Get greeting message
 *     tags: [Hello World]
 *     responses:
 *       200:
 *         description: A greeting message
 *         content:
 *           text/plain:
 *             example: Hello World!
 */
helloWorldRouter.get("/world", celebrate(getMessageSchema), controller.getMessage);

/**
 * @swagger
 * /hello/version:
 *   get:
 *     summary: Get version
 *     tags: [Hello World]
 *     responses:
 *       200:
 *         description: Version
 *         content:
 *           text/plain:
 *             example: 1.0.0
 */
helloWorldRouter.get("/version", celebrate(getVersionSchema), controller.getVersion);

/**
 * @swagger
 * /hello/not-found:
 *   get:
 *     summary: Not found
 *     tags: [Hello World]
 *     responses:
 *       404:
 *         description: Not found
 */
helloWorldRouter.get("/not-found", controller.notFound);

export default helloWorldRouter;
