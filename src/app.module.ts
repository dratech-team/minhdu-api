import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigService} from "./core/config/config.service";
import {ConfigModule} from "./core/config/config.module";
import {LoggerMiddleware} from "./core/middlewares/logger.middleware";
import {DepartmentModule} from "./api/v1/department/department.module";
import {AuthModule} from './api/v1/auth/auth.module';
import {SwaggerModule} from "@nestjs/swagger";
import {PositionModule} from "./api/v1/position/position.module";
import {BranchModule} from "./api/v1/branch/branch.module";
import {AreaModule} from "./api/v1/area/area.module";
import {EmployeeModule} from "./api/v1/employee/employee.module";
import {PayrollModule} from "./api/v1/payroll/payroll.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.mongoURL,
        useUnifiedTopology: true,
        connectionName: configService.databaseName,
        connectionFactory: (connection) => {
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    SwaggerModule,
    PayrollModule,
    EmployeeModule,
    AreaModule,
    ConfigModule,
    PositionModule,
    DepartmentModule,
    BranchModule,
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
