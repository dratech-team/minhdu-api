import {Module} from '@nestjs/common';
import {FinanceService} from './finance.service';
import {FinanceController} from './finance.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [FinanceController],
  providers: [PrismaService, FinanceService]
})
export class FinanceModule {
}
