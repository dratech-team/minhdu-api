import {Module} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {PayrollController} from './payroll.controller';
import {PrismaService} from "../../../prisma.service";
import {SalaryService} from "../salary/salary.service";
import {SalaryModule} from "../salary/salary.module";

@Module({
  imports: [SalaryModule],
  controllers: [PayrollController],
  providers: [PayrollService, PrismaService],
  exports: [PayrollService]
})
export class PayrollModule {
}
