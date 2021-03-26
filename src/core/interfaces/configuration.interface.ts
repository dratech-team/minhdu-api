import { NODE_ENV } from "@/constants/config.constant";

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

  MICROSERVICE_PORT: string;

  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;

  GMAIL_USERNAME: string;
  GMAIL_PASSWORD: string;

  GOOGLE_API_KEY: string;

  ONE_SIGNAL_APP_ID_FOR_BUYER: string;
  ONE_SIGNAL_REST_KEY_FOR_BUYER: string;

  ONE_SIGNAL_APP_ID_FOR_MERCHANT: string;
  ONE_SIGNAL_REST_KEY_FOR_MERCHANT: string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  APP_API_KEY: string;

  SSL_PRIVATE_KEY: string;
  SSL_CERTIFICATE: string;

  PUBLIC_KEY: string;
  PRIVATE_KEY: string;

  HERE_APP_ID: string;
  HERE_API_KEY: string;

  API_PATH: string;

  MANGO_CLIENT_ID: string;
  MANGO_API_KEY: string;
  MANGO_SERVER_URL: string;
  MANGO_VERSION: string;

  DB_NAME: string;

  AMPLITUDE_API_KEY: string;
  AMPLITUDE_SECRET_KEY: string;
  AMPLITUDE_PROJECT_ID: string;

  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_TEST_ACCOUNT_SID: string;
  TWILIO_TEST_AUTH_TOKEN: string;
  TWILIO_TEST_PHONE_NUMBER: string;

  ADMIN_KEY: string;

  MOLLIE_LIVE_API_KEY: string;
  MOLLIE_TEST_API_KEY: string;
  MOLLIE_SERVER_URL: string;
  MOLLIE_VERSION: string;
  MOLLIE_PROFILE_ID: string;

  REDIS_HOST: string;
  REDIS_PORT: string;
}
