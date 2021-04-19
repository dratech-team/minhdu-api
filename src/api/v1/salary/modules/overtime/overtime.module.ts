import { Module } from "@nestjs/common";
import { OvertimeController } from "./overtime.controller";
import { OvertimeService } from "./overtime.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { OvertimeSalaryEntity } from "./entities/overtime-salary.entity";
import { BasicSalaryModule } from "../basic/basic-salary.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.OVERTIME_SALARY, schema: OvertimeSalaryEntity },
    ]),
    BasicSalaryModule,
  ],
  controllers: [OvertimeController],
  providers: [OvertimeService],
  exports: [OvertimeService],
})
export class OvertimeModule {}
