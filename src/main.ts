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
import { WebsocketsExceptionFilter } from "@/filters/ws-exception.filter";
import { HttpExceptionFilter } from "@/filters/http-exception.filter";
import { AllExceptionFilter } from "@/filters/all-exception.filter";
import helmet from "helmet";
import { ConfigService } from "@/config/config.service";
import * as requestIp from "request-ip";
import { mongoMorgan } from "@/functions/mongo-morgan.function";

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
    <p> 🪲: bug </p>
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
