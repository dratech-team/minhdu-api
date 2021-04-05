import { Module } from "@nestjs/common";
import { SalaryController } from "./salary.controller";
import { SalaryService } from "./salary.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SalarySchema } from "./schemas/salary.schema";
import { ModelName } from "@/constants/database.constant";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.SALARY, schema: SalarySchema },
    ]),
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
  exports: [SalaryService],
})
export class SalaryModule {}
