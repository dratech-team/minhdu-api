import {Module} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {PayrollController} from './payroll.controller';
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config/config.module";
import {EmployeeModule} from "../employee/employee.module";
import {PayrollRepository} from "./payroll.repository";
import {EmployeeRepository} from "../employee/employee.repository";

@Module({
  imports: [ConfigModule, EmployeeModule],
  controllers: [PayrollController],
  providers: [PayrollService, PrismaService, PayrollRepository, EmployeeRepository],
  exports: [PayrollService]
})
export class PayrollModule {
}
