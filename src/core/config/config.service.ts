import * as dotenv from "dotenv";
import * as fs from "fs";
import * as Joi from "joi";
import { EnvConfig, IEnvConfig } from "@/interfaces/configuration.interface";
import { NODE_ENV, NODE_ENV_LIST } from "@/constants/config.constant";

export class ConfigService {
  private readonly envConfig: IEnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = ConfigService.validateInput(config);

    this.envConfig.PUBLIC_KEY = fs.readFileSync(
      this.envConfig.SSL_CERTIFICATE,
      "utf8"
    );

    this.envConfig.PRIVATE_KEY = fs.readFileSync(
      this.envConfig.SSL_PRIVATE_KEY,
      "utf8"
    );
  }

  private static validateInput(envConfig: EnvConfig): IEnvConfig {
    const envVarsSchema = Joi.object<IEnvConfig>({
      NODE_ENV: Joi.string()
        .valid(...NODE_ENV_LIST)
        .default(NODE_ENV.LOCAL),

      APP_NAME: Joi.string().required(),

      DATABASE_URI: Joi.string().required(),
      SERVER_URL: Joi.string().required(),
      PUBLIC_SERVER_URL: Joi.string().required(),
      PORT: Joi.string().required(),
      MICROSERVICE_PORT: Joi.string().required(),

      FACEBOOK_APP_ID: Joi.string().required(),
      FACEBOOK_APP_SECRET: Joi.string().required(),

      GMAIL_USERNAME: Joi.string().required(),
      GMAIL_PASSWORD: Joi.string().required(),

      GOOGLE_API_KEY: Joi.string().required(),

      ONE_SIGNAL_APP_ID_FOR_BUYER: Joi.string().required(),
      ONE_SIGNAL_REST_KEY_FOR_BUYER: Joi.string().required(),

      ONE_SIGNAL_APP_ID_FOR_MERCHANT: Joi.string().required(),
      ONE_SIGNAL_REST_KEY_FOR_MERCHANT: Joi.string().required(),

      CLOUDINARY_CLOUD_NAME: Joi.string().required(),
      CLOUDINARY_API_KEY: Joi.string().required(),
      CLOUDINARY_API_SECRET: Joi.string().required(),

      SSL_PRIVATE_KEY: Joi.string().required(),
      SSL_CERTIFICATE: Joi.string().required(),

      APP_API_KEY: Joi.string().required(),

      API_PATH: Joi.string().required(),

      HERE_APP_ID: Joi.string().required(),
      HERE_API_KEY: Joi.string().required(),

      MANGO_CLIENT_ID: Joi.string().required(),
      MANGO_API_KEY: Joi.string().required(),
      MANGO_SERVER_URL: Joi.string().required(),
      MANGO_VERSION: Joi.string().required(),

      DB_NAME: Joi.string().required(),

      AMPLITUDE_API_KEY: Joi.string().required(),
      AMPLITUDE_SECRET_KEY: Joi.string().required(),
      AMPLITUDE_PROJECT_ID: Joi.string().required(),

      // changes:  add twilio test and live keys
      TWILIO_ACCOUNT_SID: Joi.string().required(),
      TWILIO_AUTH_TOKEN: Joi.string().required(),
      TWILIO_TEST_ACCOUNT_SID: Joi.string().required(),
      TWILIO_TEST_AUTH_TOKEN: Joi.string().required(),
      TWILIO_TEST_PHONE_NUMBER: Joi.string().required(),

      ADMIN_KEY: Joi.string().required(),

      MOLLIE_LIVE_API_KEY: Joi.string().required(),
      MOLLIE_TEST_API_KEY: Joi.string().required(),
      MOLLIE_SERVER_URL: Joi.string().required(),
      MOLLIE_VERSION: Joi.string().required(),
      MOLLIE_PROFILE_ID: Joi.string().required(),

      REDIS_HOST: Joi.string().required(),
      REDIS_PORT: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig as IEnvConfig;
  }

  get apiPath(): string {
    return this.envConfig.API_PATH;
  }

  get rootMongoUri(): string {
    return this.envConfig.DATABASE_URI;
  }

  get databaseName(): string {
    return this.envConfig.DB_NAME;
  }

  get serverPort(): string {
    return this.envConfig.PORT;
  }

  get adminKey(): string {
    return this.envConfig.ADMIN_KEY;
  }

  get appApiKey(): string {
    return this.envConfig.APP_API_KEY;
  }
}
