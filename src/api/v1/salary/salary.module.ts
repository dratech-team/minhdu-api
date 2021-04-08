import { Module } from "@nestjs/common";
import { SalaryController } from "./salary.controller";
import { SalaryService } from "./salary.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SalarySchema } from "./schema/salary.schema";
import { AllowanceModule } from "./modules/allowance/allowance.module";
import { ModelName } from "@/core/constants/database.constant";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.SALARY, schema: SalarySchema },
    ]),
    AllowanceModule,
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule {}
