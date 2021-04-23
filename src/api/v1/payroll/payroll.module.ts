import {Module} from "@nestjs/common";
import {PayrollController} from "./payroll.controller";
import {PayrollService} from "./payroll.service";
import {MongooseModule} from "@nestjs/mongoose";
import {PayrollEntity} from "./entities/payroll.entity";
import {AllowanceModule} from "../allowance/allowance.module";
import {ModelName} from "../../../common/constant/database.constant";
import {OvertimeModule} from "../overtime/overtime.module";
import {BasicSalaryModule} from "../basic/basic-salary.module";
import {LoanSalaryModule} from "../loan/loan-salary.module";
import {DeductionSalaryModule} from "../deduction/deduction-salary.module";
import {OtherModule} from "../other/other.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ModelName.SALARY, schema: PayrollEntity},
    ]),
    AllowanceModule,
    OvertimeModule,
    BasicSalaryModule,
    LoanSalaryModule,
    DeductionSalaryModule,
    OtherModule,
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService]
})
export class PayrollModule {
}
