import {Module} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {PayrollController} from './payroll.controller';
import {PayrollRepository} from "./payroll.repository";
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config";
import {HttpModule} from "@nestjs/axios";
import {EmployeeModule} from "../../v1/employee/employee.module";
import {SalaryModule} from "../salaries/salary/salary.module";
import {AllowanceModule} from "../../v1/salaries/allowance/allowance.module";
import {AbsentModule} from "../../v1/salaries/absent/absent.module";
import {OvertimeModule} from "../../v1/salaries/overtime/overtime.module";
import {RemoteModule} from "../../v1/salaries/remote/remote.module";
import {EmployeeRepository} from "../../v1/employee/employee.repository";
import {SalaryRepository} from "../salaries/salary/salary.repository";
import {AllowanceRepository} from "../../v1/salaries/allowance/allowance.repository";
import {AbsentRepository} from "../../v1/salaries/absent/absent.repository";
import {OvertimeRepository} from "../../v1/salaries/overtime/overtime.repository";
import {RemoteRepository} from "../../v1/salaries/remote/remote.repository";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    EmployeeModule,
    SalaryModule,
    AllowanceModule,
    AbsentModule,
    OvertimeModule,
    RemoteModule
  ],
  controllers: [PayrollController],
  providers: [
    PayrollService,
    PayrollRepository,
    PrismaService,
    EmployeeRepository,
    SalaryRepository,
    AllowanceRepository,
    AbsentRepository,
    OvertimeRepository,
    RemoteRepository
  ]
})
export class PayrollModule {
}
