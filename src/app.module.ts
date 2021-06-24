import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AppController} from "./app.controller";
import {PrismaService} from "./prisma.service";
import {BranchModule} from "./api/v2/branch/branch.module";
import {DepartmentModule} from './api/v2/department/department.module';
import {PositionModule} from './api/v2/position/position.module';
import {EmployeeModule} from './api/v2/employee/employee.module';
import {AuthModule} from './api/v2/auth/auth.module';
import {PayrollModule} from './api/v2/payroll/payroll.module';
import {OrgChartModule} from './api/v2/org-chart/org-chart.module';
import {SalaryModule} from './api/v2/salary/salary.module';
import {ConfigModule} from "./core/config/config.module";
import {ContractModule} from './api/v2/contract/contract.module';
import {SalaryHistoryModule} from './api/v2/salary-history/salary-history.module';
import {LoggerMiddleware} from "./core/middlewares/logger.middleware";
import {PayrollController} from "./api/v2/payroll/payroll.controller";
import {WorkHistoryModule} from './api/v2/work-history/work-history.module';
import {NationModule} from './api/v2/nation/nation.module';
import {ProvinceModule} from './api/v2/province/province.module';
import {DistrictModule} from './api/v2/district/district.module';
import {WardModule} from './api/v2/ward/ward.module';
import {SocialModule} from './api/v2/social/social.module';
import {BankModule} from './api/v2/bank/bank.module';
import { DegreeModule } from './api/v2/degree/degree.module';
import {RelativeModule} from "./api/v2/relative/relative.module";

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
    ContractModule,
    SalaryHistoryModule,
    WorkHistoryModule,
    NationModule,
    ProvinceModule,
    DistrictModule,
    WardModule,
    SocialModule,
    BankModule,
    DegreeModule,
    RelativeModule
  ],
  controllers: [AppController],
  providers: [PrismaService],
})

/*
* Các req cố ý sửa đổi, xoá thành công sẽ được ghi lại trong lịch sử db
* */
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes(PayrollController);
  }

}
