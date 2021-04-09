import { Module } from "@nestjs/common";
import { OvertimeController } from "./overtime.controller";
import { OvertimeService } from "./overtime.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { OvertimeSalarySchema } from "./schema/overtime-salary.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.OVERTIME_SALARY, schema: OvertimeSalarySchema },
    ]),
  ],
  controllers: [OvertimeController],
  providers: [OvertimeService],
  exports: [OvertimeService],
})
export class OvertimeModule {}
