import { Module } from "@nestjs/common";
import { SalaryController } from "./salary.controller";
import { SalaryService } from "./salary.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SalarySchema } from "./schema/salary.schema";
import { AllowanceModule } from "./modules/allowance/allowance.module";
import { ModelName } from "../../../common/constant/database.constant";
import { OvertimeModule } from "./modules/overtime/overtime.module";
import { BasicSalaryModule } from "./modules/basic/basic-salary.module";
import { LoanSalaryModule } from "./modules/loan/loan-salary.module";
import { DeductionSalaryModule } from "./modules/deduction/deduction-salary.module";
import { OtherModule } from "./modules/other/other.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.SALARY, schema: SalarySchema },
    ]),
    AllowanceModule,
    OvertimeModule,
    BasicSalaryModule,
    LoanSalaryModule,
    DeductionSalaryModule,
    OtherModule,
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule {}
