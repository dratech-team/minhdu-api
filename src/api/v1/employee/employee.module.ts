import {Module} from "@nestjs/common";
import {EmployeeController} from "./employee.controller";
import {EmployeeService} from "./employee.service";
import {AreaModule} from "../area/area.module";
import {PayrollModule} from "../payroll/payroll.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {EmployeeSchema} from "./entities/employee.entity";
import {PositionModule} from "../position/position.module";
import {BranchModule} from "../branch/branch.module";

@Module({
  imports: [
    MongooseModule.forFeature([{name: ModelName.EMPLOYEE, schema: EmployeeSchema}]),
    AreaModule,
    PayrollModule,
    PositionModule,
    BranchModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService]
})
export class EmployeeModule {
}

