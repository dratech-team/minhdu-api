import {Module} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {PayrollController} from './payroll.controller';
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [PayrollController],
  providers: [PayrollService, PrismaService],
  exports: [PayrollService]
})
export class PayrollModule {
}
