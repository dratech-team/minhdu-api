import {Module} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {SalaryController} from "./salary.controller";
import {SalaryRepository} from "./salary.repository";
import {SalaryService} from "./salary.service";
import {PayrollModule} from "../payroll/payroll.module";
import {PayrollRepository} from "../payroll/payroll.repository";
import {EmployeeModule} from "../employee/employee.module";
import {EmployeeRepository} from "../employee/employee.repository";

@Module({
  imports: [
    EmployeeModule,
    PayrollModule,
  ],
  controllers: [SalaryController],
  providers: [
    SalaryRepository,
    SalaryService,
    PrismaService,
    EmployeeRepository,
    PayrollRepository,
  ],
  exports: [SalaryService],
})
export class SalaryModule {
}
