import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {PrismaService} from "./prisma.service";
import {BranchModule} from "./api/v2/branch/branch.module";
import { DepartmentModule } from './api/v2/department/department.module';
import { PositionModule } from './api/v2/position/position.module';
import { EmployeeModule } from './api/v2/employee/employee.module';
import { AuthModule } from './api/v2/auth/auth.module';
import { PayrollModule } from './api/v2/payroll/payroll.module';
import { OrgChartModule } from './api/v2/org-chart/org-chart.module';
import { SalaryModule } from './api/v2/salary/salary.module';
import {ConfigModule} from "./core/config/config.module";

@Module({
  imports: [
    BranchModule,
    DepartmentModule,
    PositionModule,
    EmployeeModule,
    AuthModule,
    PayrollModule,
    OrgChartModule,
    SalaryModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {

}

// import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
// import {AppController} from "./app.controller";
// // import {AppService} from "./app.service";
// import {MongooseModule} from "@nestjs/mongoose";
// import {ConfigService} from "./core/config/config.service";
// import {ConfigModule} from "./core/config/config.module";
// import {LoggerMiddleware} from "./core/middlewares/logger.middleware";
// import {DepartmentModule} from "./api/v1/department/department.module";
// import {AuthModule} from './api/v1/auth/auth.module';
// import {SwaggerModule} from "@nestjs/swagger";
// import {PositionModule} from "./api/v1/position/position.module";
// import {BranchModule} from "./api/v1/branch/branch.module";
// import {AreaModule} from "./api/v1/area/area.module";
// import {EmployeeModule} from "./api/v1/employee/employee.module";
// import {PayrollModule} from "./api/v1/payroll/payroll.module";
// import {AppService} from "./app.service";
//
// @Module({
//   imports: [
//     MongooseModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         uri: configService.mongoURL,
//         useUnifiedTopology: true,
//         connectionName: configService.databaseName,
//         connectionFactory: (connection) => {
//           return connection;
//         }
//       }),
//       inject: [ConfigService],
//     }),
//     SwaggerModule,
//     PayrollModule,
//     EmployeeModule,
//     AreaModule,
//     ConfigModule,
//     PositionModule,
//     DepartmentModule,
//     BranchModule,
//     AuthModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): any {
//     consumer.apply(LoggerMiddleware);
//   }
// }

