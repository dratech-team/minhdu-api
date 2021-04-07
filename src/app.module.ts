import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule, MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { SalaryModule } from "./api/v1/salary/salary.module";
import { LoggerMiddleware } from "@/middlewares/logger.middleware";
import { ConfigService } from "@/config/config.service";
import { MONGO_CONNECTION } from "@/constants/mongo-connection.constant";
import { ConfigModule } from "@/config/config.module";
import { UserModule } from "./api/v1/user/user.module";
import { CampModule } from "./api/v1/camp/camp.module";
import { AreaModule } from "./api/v1/area/area.module";
import { BasicSalaryModule } from "./api/v1/basic-salary/basic-salary.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        ({
          uri: configService.mongoURL,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
          connectionName: configService.databaseName,
        } as MongooseModuleAsyncOptions),
      inject: [ConfigService],
    }),
    SalaryModule,
    UserModule,
    CampModule,
    AreaModule,
    BasicSalaryModule,
    ConfigModule,
    // AuthModule, public all api for development
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware);
  }
}
