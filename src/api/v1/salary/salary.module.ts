import { Module } from "@nestjs/common";
import { SalaryController } from "./salary.controller";
import { SalaryService } from "./salary.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SalarySchema } from "./schema/salary.schema";
import { AllowanceModule } from "./modules/allowance/allowance.module";
import { ModelName } from "../../../core/constants/database.constant";
// import { ModelName } from "@/core/constants/database.constant";
import { OvertimeModule } from './module/overtime/overtime.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.SALARY, schema: SalarySchema },
    ]),
    AllowanceModule,
    OvertimeModule,
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule {}
