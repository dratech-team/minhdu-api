import { Module } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { OrderHistoryController } from './order-history.controller';
import {PrismaService} from "../../../../prisma.service";
import {ConfigModule} from "../../../../core/config";

@Module({
  imports: [ConfigModule],
  controllers: [OrderHistoryController],
  providers: [OrderHistoryService, PrismaService],
  exports: [OrderHistoryService]
})
export class OrderHistoryModule {}
