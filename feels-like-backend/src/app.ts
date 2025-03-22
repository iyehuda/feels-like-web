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

// eslint-disable-next-line max-statements
export function createApp() {
  const app = express();

  // Request logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.use(morgan(environment === Environment.PROD ? "combined" : "dev"));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
  
  // Configure CORS based on environment
  if (environment === Environment.DEV) {
    app.use(cors({
      origin: true, // Allow all origins in development
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
  } else {
    app.use(cors({
      origin: [
        'https://node50.cs.colman.ac.il:443',
        'https://node50.cs.colman.ac.il',
        'https://localhost:443',
        'https://localhost'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
  }

  // Root path handler
  app.get('/', (req, res) => {
    res.json({ message: 'Feels Like API is running' });
  });

  if (environment !== Environment.PROD) {
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(apiSpecs));
  }

  // Serve static files with error handling
  app.use(`/${uploadsDir}`, express.static(path.join(process.cwd(), uploadsDir), {
    setHeaders: (res, path) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }));

  // API routes with error handling
  app.use("/auth", (req, res, next) => {
    authRouter(req, res, (err) => {
      if (err) {
        console.error('Auth route error:', err);
        next(err);
      } else {
        next();
      }
    });
  });

  app.use("/users", authMiddleware, (req, res, next) => {
    userRouter(req, res, (err) => {
      if (err) {
        console.error('Users route error:', err);
        next(err);
      } else {
        next();
      }
    });
  });

  app.use("/posts", authMiddleware, (req, res, next) => {
    postRouter(req, res, (err) => {
      if (err) {
        console.error('Posts route error:', err);
        next(err);
      } else {
        next();
      }
    });
  });

  app.use("/comments", authMiddleware, (req, res, next) => {
    commentRouter(req, res, (err) => {
      if (err) {
        console.error('Comments route error:', err);
        next(err);
      } else {
        next();
      }
    });
  });

  app.use("/posts", authMiddleware, (req, res, next) => {
    likeRouter(req, res, (err) => {
      if (err) {
        console.error('Likes route error:', err);
        next(err);
      } else {
        next();
      }
    });
  });

  app.use("/weather", authMiddleware, (req, res, next) => {
    weatherRouter(req, res, (err) => {
      if (err) {
        console.error('Weather route error:', err);
        next(err);
      } else {
        next();
      }
    });
  });

  // 404 handler
  app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Not Found' });
  });

  // Error handlers
  app.use(errors());
  app.use(errorHandler({ includeStack: environment === Environment.DEV }));

  return app;
}
