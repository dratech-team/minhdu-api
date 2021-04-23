import { Module } from "@nestjs/common";
import { OtherController } from "./other.controller";
import { OtherService } from "./other.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../common/constant/database.constant";
import { OtherSalarySchema } from "./entities/other-salary.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.OTHER_SALARY, schema: OtherSalarySchema },
    ]),
  ],
  controllers: [OtherController],
  providers: [OtherService],
})
export class OtherModule {}
