// import { NODE_ENV } from "@/core/constants/config.constant";

import { NODE_ENV } from "../constants/config.constant";

export interface EnvConfig {
  [key: string]: string;
}

export interface IEnvConfig {
  NODE_ENV: NODE_ENV;

  APP_NAME: string;
  
  PORT: string;
  DATABASE_URL: string;
  DB_NAME: string;
  API_PATH: string;
  APP_API_KEY: string;
  ADMIN_KEY: string;

  PRIVATE_KEY: string;
  PUBLIC_KEY: string;
}
