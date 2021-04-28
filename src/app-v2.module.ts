import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {LoggerMiddleware} from "./core/middlewares/logger.middleware";

@Module({
  imports: [

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppV2Module implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware);
  }
}
