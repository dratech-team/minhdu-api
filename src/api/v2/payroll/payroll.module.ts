import {Module} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {PayrollController} from './payroll.controller';
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config/config.module";
import {EmployeeModule} from "../employee/employee.module";
import {PayrollRepository} from "./payroll.repository";
import {EmployeeRepository} from "../employee/employee.repository";
import {SalaryRepository} from "../salary/salary.repository";
import {SalaryModule} from "../salary/salary.module";

@Module({
  imports: [ConfigModule, EmployeeModule, SalaryModule],
  controllers: [PayrollController],
  providers: [PayrollService, PrismaService, PayrollRepository, EmployeeRepository, SalaryRepository],
  exports: [PayrollService]
})
export class PayrollModule {
}
