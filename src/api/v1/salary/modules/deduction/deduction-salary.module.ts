import { Module } from "@nestjs/common";
import { DeductionService } from "./deduction-salary.service";
import { DeductionSalaryController } from "./deduction-salary.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { DeductionSalaryEntity } from "./entities/deduction-salary.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.DEDUCTION_SALARY, schema: DeductionSalaryEntity },
    ]),
  ],
  controllers: [DeductionSalaryController],
  providers: [DeductionService],
})
export class DeductionSalaryModule {}
