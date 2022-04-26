import { Module } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { OrderHistoryController } from './order-history.controller';
import {PrismaService} from "../../../../prisma.service";

@Module({
  controllers: [OrderHistoryController],
  providers: [OrderHistoryService, PrismaService]
})
export class OrderHistoryModule {}
