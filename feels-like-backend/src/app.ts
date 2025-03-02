import { Environment, environment } from "./config";
import bodyParser from "body-parser";
import { errors } from "celebrate";
import express from "express";
import helloWorldRouter from "./routes/hello-world";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import errorHandler from "error-handler-json";
import morgan from "morgan";

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

export function createApp() {
  const app = express();

  app.use(morgan(environment === Environment.PROD ? "combined" : "dev"));
  app.use(bodyParser.json());
  app.use(cors());

  if (environment !== Environment.PROD) {
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(apiSpecs));
  }

  app.use("/hello", helloWorldRouter);
  app.use(errors());
  app.use(errorHandler({ includeStack: environment === Environment.DEV }));

  return app;
}
