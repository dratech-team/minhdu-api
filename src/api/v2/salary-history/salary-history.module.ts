import {Module} from '@nestjs/common';
import {SalaryHistoryService} from './salary-history.service';
import {SalaryHistoryController} from './salary-history.controller';
import {PrismaService} from "../../../prisma.service";
import {SalaryHistoryRepository} from "./salary-history.repository";

@Module({
  controllers: [SalaryHistoryController],
  providers: [PrismaService, SalaryHistoryService, SalaryHistoryRepository]
})
export class SalaryHistoryModule {
}
