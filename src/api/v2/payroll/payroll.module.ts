import {Module} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {PayrollController} from './payroll.controller';
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config/config.module";
import {PayrollRepository} from "./payroll.repository";
import {EmployeeModule} from "../employee/employee.module";
import {EmployeeRepository} from "../employee/employee.repository";
import {HttpModule} from "@nestjs/axios";
import {PayrollServicev2} from "./payroll.service.v2";
import {Payrollv3Controller} from "./payroll.controller.v3";
import {AbsentRepository} from "../salaries/absent/absent.repository";
import {OvertimeRepository} from "../salaries/overtime/overtime.repository";
import {OvertimeModule} from "../salaries/overtime/overtime.module";
import {AbsentModule} from "../salaries/absent/absent.module";
import {Salaryv2Repository} from "../salaries/salaryv2/salaryv2.repository";
import {Salaryv2Module} from "../salaries/salaryv2/salaryv2.module";
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
    Payrollv3Controller
  ],
  providers: [
    PrismaService,
    PayrollRepository,
    PayrollService,
    PayrollServicev2,
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
