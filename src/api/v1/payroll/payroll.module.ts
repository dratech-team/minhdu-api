import {Module} from "@nestjs/common";
import {PayrollController} from "./payroll.controller";
import {PayrollService} from "./payroll.service";
import {MongooseModule} from "@nestjs/mongoose";
import {PayrollSchema} from "./entities/payroll.entity";
import {ModelName} from "../../../common/constant/database.constant";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ModelName.SALARY, schema: PayrollSchema},
    ]),
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService]
})
export class PayrollModule {
}
