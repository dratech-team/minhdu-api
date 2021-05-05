import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [SalaryController],
  providers: [SalaryService, PrismaService],
  exports: [SalaryService]
})
export class SalaryModule {}
