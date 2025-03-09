import { Environment, environment, uploadsDir } from "./config";
import bodyParser from "body-parser";
import { errors } from "celebrate";
import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import errorHandler from "error-handler-json";
import morgan from "morgan";
import authRouter from "./routes/auth";
import userRouter from "./routes/users";
import { authMiddleware } from "./controllers/auth";

const apiSpecs = swaggerJSDoc({
  apis: ["src/routes/*.ts"],
  definition: {
    info: {
      description: "This is an API for Feels Like application",
      title: "Feels Like App API",
      version: "1.0.0",
    },
    openapi: "3.1.0",
  },
});

// eslint-disable-next-line max-statements
export function createApp() {
  const app = express();

  app.use(morgan(environment === Environment.PROD ? "combined" : "dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  if (environment !== Environment.PROD) {
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(apiSpecs));
  }

  app.use(`/${uploadsDir}`, express.static(uploadsDir));
  app.use("/auth", authRouter);
  app.use("/users", authMiddleware, userRouter);
  app.use(errors());
  app.use(errorHandler({ includeStack: environment === Environment.DEV }));

  return app;
}
