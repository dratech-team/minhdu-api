import { Module } from "@nestjs/common";
import { AllowanceController } from "./allowance.controller";
import { AllowanceService } from "./allowance.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AllowanceSalarySchema } from "./entities/allowance-salary.schema";
import { ModelName } from "../../../../../common/constant/database.constant";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.ALLOWANCE_SALARY, schema: AllowanceSalarySchema },
    ]),
  ],
  controllers: [AllowanceController],
  providers: [AllowanceService],
})
export class AllowanceModule {}
