import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import * as helmet from "helmet";
import * as compression from "compression";
import * as rateLimit from "express-rate-limit";
import { APP_FILTER } from "@nestjs/core";
import { HttpErrorFilter } from "./filters/exception.filter";
import { ConfigModule } from "@nestjs/config";
import { PagingMiddleware } from "./middlewares/paging.middleware";
import { ResponseMiddleware } from "./middlewares/response.middleware";
import { TranslationModule } from './translation/translation.module';

@Global()
@Module({
  imports: [
    // ConfigModule.forRoot({
    //     envFilePath: ['.env'],
    //     load: [configuration],
    //     isGlobal: true,
    //     expandVariables: true,
    // }),
    /* handle for cron */
    // ScheduleModule.forRoot()
    ConfigModule.forRoot(),
    TranslationModule,
  ],

  providers: [
    // ExportService,
    // ImportService,
    // PermissionService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
  exports: [
    // ExportService,
    // ImportService,
    // PermissionService,
  ],
})
export class CoresModule implements NestModule {
  /**
   * Global Middleware
   * @param consumer
   */
  configure(consumer: MiddlewareConsumer): any {
    /*
     * Common middleware:
     * - Helmet: Security http headers
     * - Compression: Gzip, deflate
     * - Rate limiting
     */
    consumer
      .apply(
        helmet(),
        compression(),
        rateLimit({
          windowMs: 1000, // 1s to reset limit
          max: 30, // limit each IP to 10 requests per windowMs
        })
      )
      .forRoutes({ path: "*", method: RequestMethod.ALL });
    consumer
      .apply(PagingMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.GET });
    consumer
      .apply(ResponseMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.GET });
  }
}
