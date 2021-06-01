import {Module} from '@nestjs/common';
import {EmployeeController} from './employee.controller';
import {PrismaService} from "../../../prisma.service";
import {SalaryModule} from "../salary/salary.module";
import {ConfigModule} from "../../../core/config/config.module";
import {PayrollModule} from "../payroll/payroll.module";
import {EmployeeRepository} from "./employee.repository";
import {BranchModule} from "../branch/branch.module";
import {BranchRepository} from "../branch/branch.repository";
import {SalaryRepository} from "../salary/salary.repository";
import {EmployeeService} from "./employee.service";

@Module({
  imports: [
    SalaryModule,
    ConfigModule,
    BranchModule
  ],
  controllers: [EmployeeController],
  providers: [
    PrismaService,
    EmployeeRepository,
    EmployeeService,
    BranchRepository,
    SalaryRepository
  ],
  exports: [EmployeeService]
})
export class EmployeeModule {
}
