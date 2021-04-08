import { Module } from "@nestjs/common";
import { SalaryController } from "./salary.controller";
import { SalaryService } from "./salary.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SalarySchema } from "./schema/salary.schema";
import { ModelName } from "@/constants/database.constant";
import { AllowanceModule } from './modules/allowance/allowance.module';

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
