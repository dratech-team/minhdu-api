import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { UsersModule } from "./api/users/users.module";
import { AuthModule } from "./api/auth/auth.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { VendorsModule } from "./api/vendors/vendors.module";
import { CoreTransformInterceptor } from "./core/interceptors/coreTransform.interceptor";
import { MaterialsWarehouseModule } from "./api/materials-warehouse/materials-warehouse.module";
import { StorageModule } from "./api/storage/storage.module";
import { config } from "dotenv";
config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  /* Interceptor overwrite response */
  // app.useGlobalInterceptors(new CoreTransformInterceptor());

  const config = app.get(ConfigService);
  /*
   * Global prefix version
   */
  let basePath = config.get("app.basePath");
  if (!basePath) basePath = "/";
  if (basePath != "/" && basePath.charAt(0) != "/")
    basePath = "/" + basePath + "/";
  app.setGlobalPrefix(basePath + "api/v1");

  /*
   * Proxy
   */
  app.set("trust proxy", 1);

  /*
   * Swagger configurations
   */

  if (process.env.NODE_ENV !== "production") {
    basePath = basePath.replace(/^\//g, "");
  }

  /* enabled swagger on heroku */
  new Swagger(app).setup(basePath);
  const PORT = process.env.PORT || 3000;
  console.log("process.env.PORT", process.env.PORT);

  await app.listen(PORT, "0.0.0.0");

  console.log("App Started", process.env.PORT);
}

class Swagger {
  constructor(private app: NestExpressApplication) {}

  /**
   * Register more swagger api here
   */
  setup(basePath): void {
    // Main API
    this.register(undefined, `${basePath}api`);
  }

  register(
    extraModules?: any[],
    path?: string,
    title?: string,
    description?: string,
    version?: string
  ): void {
    const mainModules = [
      AppModule,
      UsersModule,
      AuthModule,
      VendorsModule,
      MaterialsWarehouseModule,
      StorageModule,
    ];

    if (extraModules) {
      mainModules.push(...extraModules);
    }

    const siteTitle = title || "Example Swagger APIs";
    const options = new DocumentBuilder()
      .setTitle(siteTitle)
      .setDescription(description || "MinhDu APIs description")
      .setVersion(version || "1")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(this.app, options, {
      include: mainModules,
    });
    SwaggerModule.setup(path || "api", this.app, document, {
      customSiteTitle: siteTitle,
    });
  }
}

bootstrap();
