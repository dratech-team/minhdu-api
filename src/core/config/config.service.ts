import * as dotenv from "dotenv";
import * as fs from "fs";
import * as Joi from "joi";
import { EnvConfig, IEnvConfig } from "../interfaces/configuration.interface";
import { NODE_ENV, NODE_ENV_LIST } from "../constants/config.constant";
// import {
//   EnvConfig,
//   IEnvConfig,
// } from "@/core/interfaces/configuration.interface";
// import { NODE_ENV, NODE_ENV_LIST } from "@/core/constants/config.constant";

export class ConfigService {
  private readonly envConfig: IEnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = ConfigService.validateInput(config);
  }

  private static validateInput(envConfig: EnvConfig): IEnvConfig {
    const envVarsSchema = Joi.object<IEnvConfig>({
      NODE_ENV: Joi.string()
        .valid(...NODE_ENV_LIST)
        .default(NODE_ENV.DEVELOPMENT),

      APP_NAME: Joi.string().required(),
      DATABASE_URI: Joi.string().required(),
      SERVER_URL: Joi.string().required(),
      PUBLIC_SERVER_URL: Joi.string().required(),
      PORT: Joi.string().required(),
      API_PATH: Joi.string().required(),
      APP_API_KEY: Joi.string().required(),
      ADMIN_KEY: Joi.string().required(),
      DB_NAME: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig as IEnvConfig;
  }

  get homeConfig() {
    const SERVER_URL = "https://test.com";
    return {
      description: "NestJS Heroku Server",
      title: "NestJS Heroku Server",
      imageUrl: `${SERVER_URL}/images/1.jpg`,
      homeUrl: `${SERVER_URL}/`,
      iconUrl: `${SERVER_URL}/icons/logo.png`,
      backgroundUrl: `${SERVER_URL}/images/1.jpg`,
    };
  }

  get apiPath(): string {
    return this.envConfig.API_PATH;
  }

  get databaseName(): string {
    return this.envConfig.DB_NAME;
  }

  get mongoURL(): string {
    return this.envConfig.DATABASE_URI;
  }

  get serverPort(): string {
    return this.envConfig.PORT;
  }

  get appApiKey(): string {
    return this.envConfig.APP_API_KEY;
  }

  get adminKey(): string {
    return this.envConfig.ADMIN_KEY;
  }
}
