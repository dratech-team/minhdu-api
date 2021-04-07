import { NODE_ENV } from "@/constants/config.constant";
import * as Joi from "joi";

export interface EnvConfig {
  [key: string]: string;
}

export interface IEnvConfig {
  NODE_ENV: NODE_ENV;

  APP_NAME: string;

  DATABASE_URI: string;

  SERVER_URL: string;
  PUBLIC_SERVER_URL: string;
  PORT: string;

  DB_NAME: string;
  API_PATH: string;
  APP_API_KEY: string;
  ADMIN_KEY: string;
}
