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
import postRouter from "./routes/posts";
import commentRouter from "./routes/comments";
import likeRouter from "./routes/likes";
import weatherRouter from "./routes/weather";
import path from "path";

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

// eslint-disable-next-line max-lines-per-function, max-statements
export function createApp() {
  const app = express();

  app.use(morgan(environment === Environment.PROD ? "combined" : "dev"));
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

  const corsOptions = {
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  };

  // Configure CORS based on environment
  if (environment === Environment.DEV) {
    app.use(
      cors({
        ...corsOptions,
        origin: true,
      }),
    );
  } else {
    app.use(
      cors({
        ...corsOptions,
        origin: [
          "https://node50.cs.colman.ac.il:443",
          "https://node50.cs.colman.ac.il",
          "https://localhost:443",
          "https://localhost",
        ],
      }),
    );
  }

  // Root path handler
  app.get("/", (req, res) => {
    res.json({ message: "Feels Like API is running" });
  });

  if (environment !== Environment.PROD) {
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(apiSpecs));
  }

  // Serve static files with error handling
  app.use(
    `/${uploadsDir}`,
    express.static(path.join(process.cwd(), uploadsDir), {
      setHeaders: (res) => {
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
      },
    }),
  );

  app.use("/auth", authRouter);
  app.use("/users", authMiddleware, userRouter);
  app.use("/posts", authMiddleware, postRouter);
  app.use("/comments", authMiddleware, commentRouter);
  app.use("/posts", authMiddleware, likeRouter);
  app.use("/weather", authMiddleware, weatherRouter);

  // Error handlers
  app.use(errors());
  app.use(errorHandler({ includeStack: environment === Environment.DEV }));

  return app;
}
