import { Module } from "@nestjs/common";
import { DeductionService } from "./deduction-salary.service";
import { DeductionSalaryController } from "./deduction-salary.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { DeductionSalarySchema } from "./schema/deduction-salary.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.DEDUCTION_SALARY, schema: DeductionSalarySchema },
    ]),
  ],
  providers: [DeductionService],
  controllers: [DeductionSalaryController],
  exports: [DeductionService],
})
export class DeductionSalaryModule {}
