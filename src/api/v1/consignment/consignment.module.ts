import { Module } from '@nestjs/common';
import { ConsignmentService } from './consignment.service';
import { ConsignmentController } from './consignment.controller';

@Module({
  controllers: [ConsignmentController],
  providers: [ConsignmentService]
})
export class ConsignmentModule {}
