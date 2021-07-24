import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {ValidationPipe} from "@nestjs/common";
import {LoggerFilter} from "./core/filters/logger.filter";
import {PrismaService} from "./prisma.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const logger = app.get(PrismaService);
  // app.useGlobalFilters(new LoggerFilter(logger));
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}

bootstrap().then(
  () => {
    console.log('Started v2');
  }
);
