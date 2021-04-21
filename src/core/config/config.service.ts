import * as dotenv from "dotenv";
import * as fs from "fs";
import * as Joi from "joi";
import {EnvConfig, IEnvConfig} from "../interfaces/configuration.interface";
import {NODE_ENV, NODE_ENV_LIST} from "../constants/config.constant";
import {ExtractJwt, StrategyOptions} from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import {TAlgorithm} from 'jwt-simple';

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
      PRIVATE_KEY: Joi.string().required(),
      PUBLIC_KEY: Joi.string().required(),
    });

    const {error, value: validatedEnvConfig} = envVarsSchema.validate(
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

  get jwtStrategyOpts(): StrategyOptions {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.privateKey,
      jsonWebTokenOptions: this.verifyOptions,
    } as StrategyOptions;
  }

  get signOptions(): jwt.SignOptions {
    return {
      expiresIn: '3 days',
      algorithm: 'HS256',
    };
  }

  get privateKey() {
    return this.envConfig.PRIVATE_KEY;
  }

  get publicKey(): string {
    return this.envConfig.PUBLIC_KEY;
  }

  get verifyOptions(): jwt.VerifyOptions | any {
    return {
      algorithms: ['HS256'] as TAlgorithm[],
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
