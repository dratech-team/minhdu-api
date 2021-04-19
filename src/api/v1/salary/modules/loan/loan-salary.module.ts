import { Module } from "@nestjs/common";
import { LoanSalaryController } from "./loan-salary.controller";
import { LoanSalaryService } from "./loan-salary.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { LoanSalaryEntity } from "./entities/loan-salary.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.LOAN_SALARY, schema: LoanSalaryEntity },
    ]),
  ],
  controllers: [LoanSalaryController],
  providers: [LoanSalaryService],
  exports: [LoanSalaryService],
})
export class LoanSalaryModule {}
