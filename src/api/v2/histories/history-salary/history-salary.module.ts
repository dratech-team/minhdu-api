import {Module} from '@nestjs/common';
import {HistorySalaryService} from './history-salary.service';
import {PrismaService} from "../../../../prisma.service";
import {HistorySalaryRepository} from "./history-salary.repository";
/**
 *
 * @deprecated
 * */
@Module({
  providers: [PrismaService, HistorySalaryRepository, HistorySalaryService],
  exports: [HistorySalaryService]
})
export class HistorySalaryModule {
}
