import { Module } from "@nestjs/common";
import { BasicSalaryController } from "./basic-salary.controller";
import { BasicSalaryService } from "./basic-salary.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "@/constants/database.constant";
import { BasicSalarySchema } from "./schema/basic-salary.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.BASIC_SALARY, schema: BasicSalarySchema },
    ]),
  ],
  controllers: [BasicSalaryController],
  providers: [BasicSalaryService],
})
export class BasicSalaryModule {}
