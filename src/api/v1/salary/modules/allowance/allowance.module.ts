import { Module } from "@nestjs/common";
import { AllowanceController } from "./allowance.controller";
import { AllowanceService } from "./allowance.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AllowanceSalaryEntity } from "./entities/allowance-salary.entity";
import { ModelName } from "../../../../../common/constant/database.constant";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.ALLOWANCE_SALARY, schema: AllowanceSalaryEntity },
    ]),
  ],
  controllers: [AllowanceController],
  providers: [AllowanceService],
})
export class AllowanceModule {}
