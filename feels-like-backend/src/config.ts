import dotenv from "dotenv";

export enum Environment {
  DEV = "development",
  PROD = "production",
}

dotenv.config();
const defaults = {
  ENVIRONMENT: Environment.DEV,
  PORT: 3000,
};

export const environment = (process.env.NODE_ENV as Environment) ?? defaults.ENVIRONMENT;
export const port = process.env.PORT ?? defaults.PORT;
