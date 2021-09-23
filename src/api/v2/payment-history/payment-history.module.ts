import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma.service";
import { PaymentHistoryController } from "./payment-history.controller";
import { PaymentHistoryRepository } from "./payment-history.repository";
import { PaymentHistoryService } from "./payment-history.service";

@Module({
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService, PrismaService, PaymentHistoryRepository],
  exports: [PaymentHistoryService],
})
export class PaymentHistoryModule {}
