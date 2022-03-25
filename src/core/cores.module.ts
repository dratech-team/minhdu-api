import {Global, MiddlewareConsumer, Module, NestModule, RequestMethod,} from "@nestjs/common";
import * as helmet from "helmet";
import * as compression from "compression";
import * as rateLimit from "express-rate-limit";
import {APP_FILTER} from "@nestjs/core";
import {HttpErrorFilter} from "./filters/exception.filter";
import {ConfigModule} from "@nestjs/config";
import {PagingMiddleware} from "./middlewares/paging.middleware";
import {ResponseMiddleware} from "./middlewares/response.middleware";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class CoresModule implements NestModule {
  /**
   * Global Middleware
   * @param consumer
   */
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(helmet(), compression(), rateLimit({windowMs: 1000, max: 30}))
      .forRoutes({path: "*", method: RequestMethod.ALL});
    consumer.apply(PagingMiddleware).forRoutes({path: "*", method: RequestMethod.GET});
    consumer.apply(ResponseMiddleware).forRoutes({path: "*", method: RequestMethod.GET});
  }
}
