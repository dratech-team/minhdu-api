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
import {AbsentService} from "../salaries/absent/absent.service";
import {AbsentRepository} from "../salaries/absent/absent.repository";

@Module({
  imports: [ConfigModule, EmployeeModule, HttpModule],
  controllers: [PayrollController, Payrollv3Controller],
  providers: [
    PrismaService,
    PayrollRepository,
    PayrollService,
    PayrollServicev2,
    EmployeeRepository,
    AbsentService,
    AbsentRepository
  ],
  exports: [PayrollService]
})
export class PayrollModule {
}
