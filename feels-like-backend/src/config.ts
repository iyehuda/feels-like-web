import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";
import { StringValue } from "ms";

export enum Environment {
  DEV = "development",
  PROD = "production",
  TEST = "test",
}

dotenv.config();
const defaults = {
  DB_CONNECTION_STRING: "mongodb://localhost/FeelsLike?authSource=admin",
  ENVIRONMENT: Environment.DEV,
  GEMINI_API_KEY: "",
  GOOGLE_CLIENT_ID: "672265150652-k52ou841kgciope4a7qsabp595km9jhv.apps.googleusercontent.com",
  PORT: 3000,
  REFRESH_TOKEN_EXPIRES: "7d",
  SSL_CERT_PATH: "/ssl/cert.pem",
  SSL_KEY_PATH: "/ssl/key.pem",
  TOKEN_EXPIRES: "1h",
  TOKEN_SECRET:
    "6e44b1fb1a26aa1c7324b6f7b555de5446c0fa22ef02b3f176523a56c85094f7a5912ddad3b70e59f70da2ca7e75566a9c52d41adf8ae82cf9ed27106dffa103",
  UPLOADS_DIR: "uploads",
  UPLOADS_TEST_DIR: `test-uploads-${process.env.JEST_WORKER_ID}`,
  WEATHER_API_KEY: "",
};

export const dbConnectionString = process.env.DB_CONNECTION_STRING ?? defaults.DB_CONNECTION_STRING;
export const environment = (process.env.NODE_ENV as Environment) ?? defaults.ENVIRONMENT;
export const geminiApiKey = process.env.GEMINI_API_KEY ?? defaults.GEMINI_API_KEY;
export const googleClientId = process.env.GOOGLE_CLIENT_ID ?? defaults.GOOGLE_CLIENT_ID;
export const port = process.env.PORT ?? defaults.PORT;
export const sslCertPath = process.env.SSL_CERT_PATH ?? defaults.SSL_CERT_PATH;
export const sslKeyPath = process.env.SSL_KEY_PATH ?? defaults.SSL_KEY_PATH;
export const tokenSecret: Secret = process.env.TOKEN_SECRET ?? defaults.TOKEN_SECRET;
export const tokenExpires = (process.env.TOKEN_EXPIRES ?? defaults.TOKEN_EXPIRES) as StringValue;
export const refreshTokenExpires = (process.env.REFRESH_TOKEN_EXPIRES ??
  defaults.REFRESH_TOKEN_EXPIRES) as StringValue;
export const uploadsDir =
  process.env.UPLOADS_DIR ??
  (environment === Environment.TEST ? defaults.UPLOADS_TEST_DIR : defaults.UPLOADS_DIR);
export const weatherApiKey = process.env.WEATHER_API_KEY ?? defaults.WEATHER_API_KEY;
