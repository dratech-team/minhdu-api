import { Module } from "@nestjs/common";
import { WarehouseHistoryService } from "./warehouse-history.service";
import { WarehouseHistoryController } from "./warehouse-history.controller";
import { PrismaService } from "src/prisma.service";

@Module({
  controllers: [WarehouseHistoryController],
  providers: [WarehouseHistoryService, PrismaService],
})
export class WarehouseHistoryModule {}
