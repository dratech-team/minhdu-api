import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
import {
  ExpressAdapter,
  NestExpressApplication,
} from "@nestjs/platform-express";
import * as compression from "compression";
import { join } from "path";
import * as requestIp from "request-ip";
import { ConfigService } from "./core/config/config.service";
import { WebsocketsExceptionFilter } from "./core/filters/ws-exception.filter";
import { AllExceptionFilter } from "./core/filters/all-exception.filter";
import { HttpExceptionFilter } from "./core/filters/http-exception.filter";
import { mongoMorgan } from "./core/functions/mongo-morgan.function";
// import { ConfigService } from "@/core/config/config.service";
// import { WebsocketsExceptionFilter } from "@/core/filters/ws-exception.filter";
// import { mongoMorgan } from "@/core/functions/mongo-morgan.function";
// import { AllExceptionFilter } from "@/core/filters/all-exception.filter";
// import { HttpExceptionFilter } from "@/core/filters/http-exception.filter";

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server)
  );

  const configService: ConfigService = app.get(ConfigService);

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("hbs");

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new WebsocketsExceptionFilter(),
    new AllExceptionFilter(),
    new HttpExceptionFilter()
  );

  const options = new DocumentBuilder()
    .setTitle("Minh Dư APIs")
    .addBearerAuth()
    .setDescription(
      `<p>The Minh Dư APIs documentation</p>
    <p> 🐞: bug </p>
    <p> ⌛: doing </p>
    <p> 🧑‍🔬: to test </p>
    <p> ✅: done, haven't tested yet </p>
    <p> 🌟: done, tested </p>
    <p> 🚫: deprecated </p>
    <p> 📄: support load more </p>
    `
    )
    .setVersion("⭐⚡☀✨ 0.0.1 ⭐⚡☀✨")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(configService.apiPath, app, document);

  app.enableCors(); // protection
  // app.use(csurf())
  // app.use(morgan('dev')) // 'common'
  app.use(
    mongoMorgan(
      "development",
      configService.mongoURL,
      configService.databaseName
    )
  );

  app.use(compression());
  app.use(requestIp.mw());

  const port = configService.serverPort;
  await app.listen(port);
  console.log(`[INFO] Server is listening on port ${port}`);
}

bootstrap().then();
