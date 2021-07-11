import {Module} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {PayrollController} from './payroll.controller';
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config/config.module";
import {PayrollRepository} from "./payroll.repository";
import {EmployeeModule} from "../employee/employee.module";
import {EmployeeRepository} from "../employee/employee.repository";
import {ExportService} from "../../../core/services/export.service";

@Module({
  imports: [ConfigModule, EmployeeModule, ],
  controllers: [PayrollController],
  providers: [PrismaService, PayrollService, PayrollRepository, EmployeeRepository, ExportService],
  exports: [PayrollService]
})
export class PayrollModule {
}
