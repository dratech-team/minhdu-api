import {Module} from '@nestjs/common';
import {EmployeeService} from './employee.service';
import {EmployeeController} from './employee.controller';
import {PrismaService} from "../../../prisma.service";
import {SalaryModule} from "../salary/salary.module";
import {ConfigModule} from "../../../core/config/config.module";
import {PayrollModule} from "../payroll/payroll.module";

@Module({
  imports: [SalaryModule, PayrollModule, ConfigModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, PrismaService]
})
export class EmployeeModule {
}
