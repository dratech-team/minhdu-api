import {Module} from '@nestjs/common';
import {PrismaService} from "../../../../prisma.service";
import {SalaryControllerHistory} from "./salary.controller-history";
import {SalaryHistoryService} from "./salary-history.service";

@Module({
  controllers: [SalaryControllerHistory],
  providers: [SalaryHistoryService, PrismaService]
})
export class SalaryHistoryModule {
}
