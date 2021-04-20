import { Module } from "@nestjs/common";
import { DeductionService } from "./deduction-salary.service";
import { DeductionSalaryController } from "./deduction-salary.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { DeductionSalarySchema } from "./entities/deduction-salary.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.DEDUCTION_SALARY, schema: DeductionSalarySchema },
    ]),
  ],
  controllers: [DeductionSalaryController],
  providers: [DeductionService],
})
export class DeductionSalaryModule {}
