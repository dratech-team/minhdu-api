import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {ConfigModule} from "../../../core/config/config.module";
import {AbsentModule} from "./absent/absent.module";
import {AllowanceModule} from "./allowance/allowance.module";
import {DeductionModule} from "./deduction/deduction.module";
import {OvertimeModule} from "./overtime/overtime.module";
import {RemoteModule} from "./remote/remote.module";
import {SalaryModule} from "./salary/salary.module";
import {Salaryv2Module} from "./salaryv2/salaryv2.module";
import {AllowanceController} from "./allowance/allowance.controller";
import {AbsentController} from "./absent/absent.controller";
import {OvertimeController} from "./overtime/overtime.controller";
import {RemoteController} from "./remote/remote.controller";
import {PrismaService} from "../../../prisma.service";
import {SalariesMiddleware} from "./salaries.middleware";

@Module({
  imports: [
    ConfigModule,
    AbsentModule,
    AllowanceModule,
    DeductionModule,
    OvertimeModule,
    RemoteModule,
    SalaryModule,
    Salaryv2Module
  ],
  providers: [PrismaService]
})
export class SalariesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SalariesMiddleware)
      .forRoutes(AllowanceController, AbsentController, OvertimeController, RemoteController);
  }
}
