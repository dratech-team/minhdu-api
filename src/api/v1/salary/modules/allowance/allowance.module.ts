import { Module } from "@nestjs/common";
import { AllowanceController } from "./allowance.controller";
import { AllowanceService } from "./allowance.service";
import { MongooseModule } from "@nestjs/mongoose";
// import { ModelName } from "@/core/constants/database.constant";
import { AllowanceSalarySchema } from "./schema/allowance-salary.schema";
import { ModelName } from "../../../../../core/constants/database.constant";

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
