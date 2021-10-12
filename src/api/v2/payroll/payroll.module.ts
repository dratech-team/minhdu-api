import {Module} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {PayrollController} from './payroll.controller';
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config/config.module";
import {PayrollRepository} from "./payroll.repository";
import {EmployeeModule} from "../employee/employee.module";
import {EmployeeRepository} from "../employee/employee.repository";
import {HolidayModule} from "../holiday/holiday.module";
import {HolidayRepository} from "../holiday/holiday.repository";
import {HolidayService} from "../holiday/holiday.service";
import {OvertimeTemplateModule} from "../overtime-template/overtime-template.module";

@Module({
  imports: [ConfigModule, EmployeeModule, HolidayModule, OvertimeTemplateModule],
  controllers: [PayrollController],
  providers: [PrismaService, PayrollService, PayrollRepository, EmployeeRepository, HolidayService, HolidayRepository],
  exports: [PayrollService]
})
export class PayrollModule {
}
