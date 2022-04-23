import { Module } from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { AllowanceController } from './allowance.controller';

@Module({
  controllers: [AllowanceController],
  providers: [AllowanceService]
})
export class AllowanceModule {}
