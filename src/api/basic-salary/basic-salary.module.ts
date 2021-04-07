import { Module } from '@nestjs/common';
import { BasicSalaryController } from './basic-salary.controller';
import { BasicSalaryService } from './basic-salary.service';

@Module({
  controllers: [BasicSalaryController],
  providers: [BasicSalaryService]
})
export class BasicSalaryModule {}
