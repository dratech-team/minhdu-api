import { Module } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';

@Module({
  controllers: [OvertimeController],
  providers: [OvertimeService]
})
export class OvertimeModule {}
