import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';

@Module({
  controllers: [PayrollController],
  providers: [PayrollService]
})
export class PayrollModule {}
