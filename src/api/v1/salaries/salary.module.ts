import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {ConfigModule} from "../../../core/config";
import {AbsentModule} from "./absent/absent.module";
import {AllowanceModule} from "./allowance/allowance.module";
import {DeductionModule} from "./deduction/deduction.module";
import {OvertimeModule} from "./overtime/overtime.module";
import {RemoteModule} from "./remote/remote.module";
import {SalaryModule} from "./salary/salary.module";
import {SalaryModule as SalaryModulev2} from "../../v2/salaries/salaryv2/salary.module";
import {AbsentController} from "./absent/absent.controller";
import {OvertimeController} from "./overtime/overtime.controller";
import {RemoteController} from "./remote/remote.controller";
import {PrismaService} from "../../../prisma.service";
import {SalariesDuplicateMiddleware} from "../../shared/middlewares/salaries-duplicate.middleware";
import {HolidayModule} from '../../v2/salaries/holiday/holiday.module';
import {SalariesConvertDatetimeMiddleware} from "../../shared/middlewares/salaries-convert-datime.middleware";
import {DayoffModule} from './dayoff/dayoff.module';
import {BranchModule} from './branch/branch.module';

@Module({
  imports: [
    ConfigModule,
    AbsentModule,
    AllowanceModule,
    DeductionModule,
    OvertimeModule,
    RemoteModule,
    SalaryModule,
    SalaryModulev2,
    HolidayModule,
    DayoffModule,
    BranchModule
  ],
  providers: [PrismaService]
})
export class SalariesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SalariesConvertDatetimeMiddleware, SalariesDuplicateMiddleware)
      .forRoutes(AbsentController, OvertimeController, RemoteController);
  }
}
