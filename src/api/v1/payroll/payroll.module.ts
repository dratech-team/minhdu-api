import {Module} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {PayrollController} from './payroll.controller';
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config";
import {PayrollRepository} from "./payroll.repository";
import {EmployeeModule} from "../employee/employee.module";
import {EmployeeRepository} from "../employee/employee.repository";
import {HttpModule} from "@nestjs/axios";
import {AbsentRepository} from "../salaries/absent/absent.repository";
import {OvertimeRepository} from "../salaries/overtime/overtime.repository";
import {OvertimeModule} from "../salaries/overtime/overtime.module";
import {AbsentModule} from "../salaries/absent/absent.module";
import {Salaryv2Repository} from "../../v2/salaries/salaryv2/salaryv2.repository";
import {Salaryv2Module} from "../../v2/salaries/salaryv2/salaryv2.module";
import {AllowanceModule} from "../salaries/allowance/allowance.module";
import {AllowanceRepository} from "../salaries/allowance/allowance.repository";
import {RemoteModule} from "../salaries/remote/remote.module";
import {RemoteRepository} from "../salaries/remote/remote.repository";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    EmployeeModule,
    Salaryv2Module,
    AllowanceModule,
    AbsentModule,
    OvertimeModule,
    RemoteModule
  ],
  controllers: [
    PayrollController,
  ],
  providers: [
    PrismaService,
    PayrollRepository,
    PayrollService,
    EmployeeRepository,
    Salaryv2Repository,
    AllowanceRepository,
    AbsentRepository,
    OvertimeRepository,
    RemoteRepository
  ],
  exports: [PayrollService]
})
export class PayrollModule {
}
