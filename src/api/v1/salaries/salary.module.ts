import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {ConfigModule} from "../../../core/config/config.module";
import {AbsentModule} from "./absent/absent.module";
import {AllowanceModule} from "./allowance/allowance.module";
import {DeductionModule} from "./deduction/deduction.module";
import {OvertimeModule} from "./overtime/overtime.module";
import {RemoteModule} from "./remote/remote.module";
import {SalaryModule} from "./salary/salary.module";
import {Salaryv2Module} from "./salaryv2/salaryv2.module";
import {AbsentController} from "./absent/absent.controller";
import {OvertimeController} from "./overtime/overtime.controller";
import {RemoteController} from "./remote/remote.controller";
import {PrismaService} from "../../../prisma.service";
import {SalariesDuplicateMiddleware} from "./salaries-duplicate.middleware";
import {HolidayModule} from './holiday/holiday.module';
import {SalariesConvertDatetimeMiddleware} from "./salaries-convert-datime.middleware";
import { DayoffModule } from './dayoff/dayoff.module';
import { BranchModule } from './branch/branch.module';

@Module({
  imports: [
    ConfigModule,
    AbsentModule,
    AllowanceModule,
    DeductionModule,
    OvertimeModule,
    RemoteModule,
    SalaryModule,
    Salaryv2Module,
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
