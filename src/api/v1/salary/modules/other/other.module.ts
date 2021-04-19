import { Module } from "@nestjs/common";
import { OtherController } from "./other.controller";
import { OtherService } from "./other.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { OtherSalaryEntity } from "./entities/other-salary.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.OTHER_SALARY, schema: OtherSalaryEntity },
    ]),
  ],
  controllers: [OtherController],
  providers: [OtherService],
})
export class OtherModule {}
