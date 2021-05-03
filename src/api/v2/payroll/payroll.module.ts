import {Module} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {PayrollController} from './payroll.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [PayrollController],
  providers: [PayrollService, PrismaService]
})
export class PayrollModule {
}
