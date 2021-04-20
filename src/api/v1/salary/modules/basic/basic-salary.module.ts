import { Module } from "@nestjs/common";
import { BasicSalaryController } from "./basic-salary.controller";
import { BasicSalaryService } from "./basic-salary.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BasicSalarySchema } from "./entities/basic-salary.schema";
import { ModelName } from "../../../../../common/constant/database.constant";
import { MyLoggerService } from "../../../../../core/services/mylogger.service";
// import { ModelName } from "@/core/constants/database.constant";
// import { MyLoggerService } from "@/core/services/mylogger.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.BASIC_SALARY, schema: BasicSalarySchema },
    ]),
    MyLoggerService,
  ],
  controllers: [BasicSalaryController],
  providers: [BasicSalaryService, MyLoggerService],
  exports: [BasicSalaryService],
})
export class BasicSalaryModule {}
