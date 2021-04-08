import { Module } from '@nestjs/common';
import { AllowanceController } from './allowance.controller';
import { AllowanceService } from './allowance.service';

@Module({
  controllers: [AllowanceController],
  providers: [AllowanceService]
})
export class AllowanceModule {}
