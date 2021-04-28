import {Module} from "@nestjs/common";
import {EmployeeController} from "./employee.controller";
import {EmployeeService} from "./employee.service";
import {MongooseModule} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {EmployeeSchema} from "./entities/employee.entity";
import {BranchModule} from "../branch/branch.module";

@Module({
  imports: [
    MongooseModule.forFeature([{name: ModelName.EMPLOYEE, schema: EmployeeSchema}]),
    BranchModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {
}

