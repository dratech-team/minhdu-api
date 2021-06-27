import { Module } from '@nestjs/common';
import { SystemHistoryService } from './system-history.service';
import { SystemHistoryController } from './system-history.controller';

@Module({
  controllers: [SystemHistoryController],
  providers: [SystemHistoryService]
})
export class SystemHistoryModule {}
