import { Module } from "@nestjs/common";
import { LoanSalaryController } from "./loan-salary.controller";
import { LoanSalaryService } from "./loan-salary.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { LoanSalarySchema } from "./entities/loan-salary.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.LOAN_SALARY, schema: LoanSalarySchema },
    ]),
  ],
  controllers: [LoanSalaryController],
  providers: [LoanSalaryService],
  exports: [LoanSalaryService],
})
export class LoanSalaryModule {}
