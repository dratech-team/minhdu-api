import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import {PrismaService} from "../../../prisma.service";
import {SalaryRepository} from "./salary.repository";

@Module({
  controllers: [SalaryController],
  providers: [SalaryRepository, SalaryService, PrismaService],
  exports: [SalaryService]
})
export class SalaryModule {}
