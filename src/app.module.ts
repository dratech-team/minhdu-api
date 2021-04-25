import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {MongooseModule, MongooseModuleAsyncOptions} from "@nestjs/mongoose";
import {PayrollModule} from "./api/v1/payroll/payroll.module";
import {UserModule} from "./api/v1/user/user.module";
import {AreaModule} from "./api/v1/area/area.module";
import {ConfigService} from "./core/config/config.service";
import {ConfigModule} from "./core/config/config.module";
import {LoggerMiddleware} from "./core/middlewares/logger.middleware";
import {PositionModule} from "./api/v1/position/position.module";
import {DepartmentModule} from "./api/v1/department/department.module";
import {BranchModule} from './api/v1/branch/branch.module';
import {AuthModule} from './api/v1/auth/auth.module';
import {SwaggerModule} from "@nestjs/swagger";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        uri: configService.mongoURL,
        useUnifiedTopology: true,
        connectionName: configService.databaseName,
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          connection.plugin(require('./common/plugins/mongoose-found.plugin'));
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    SwaggerModule,
    // PayrollModule,
    // UserModule,
    // AreaModule,
    ConfigModule,
    // PositionModule,
    DepartmentModule,
    // BranchModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware);
  }
}
