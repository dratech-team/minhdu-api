import { Module } from "@nestjs/common";
import { OvertimeController } from "./overtime.controller";
import { OvertimeService } from "./overtime.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { OvertimeSalarySchema } from "./schema/overtime-salary.schema";
import { BasicSalaryModule } from "../basic/basic-salary.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.OVERTIME_SALARY, schema: OvertimeSalarySchema },
    ]),
    BasicSalaryModule,
  ],
  controllers: [OvertimeController],
  providers: [OvertimeService],
  exports: [OvertimeService],
})
export class OvertimeModule {}
