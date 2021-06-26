import {Module} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {PayrollController} from './payroll.controller';
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config/config.module";
import {PayrollRepository} from "./payroll.repository";
import {EmployeeModule} from "../employee/employee.module";
import {EmployeeRepository} from "../employee/employee.repository";
import {SalaryModule} from "../salary/salary.module";
import {SalaryRepository} from "../salary/salary.repository";

@Module({
  imports: [ConfigModule, EmployeeModule, SalaryModule],
  controllers: [PayrollController],
  providers: [PrismaService, PayrollService, PayrollRepository, EmployeeRepository, SalaryRepository],
  exports: [PayrollService]
})
export class PayrollModule {
}
