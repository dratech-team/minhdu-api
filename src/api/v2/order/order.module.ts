import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { PrismaService } from "../../../prisma.service";
import { OrderRepository } from "./order.repository";
import { CommodityModule } from "../commodity/commodity.module";
import { CommodityService } from "../commodity/commodity.service";
import { CommodityRepository } from "../commodity/commodity.repository";
import { PaymentHistoryRepository } from "../payment-history/payment-history.repository";
import { PaymentHistoryService } from "../payment-history/payment-history.service";
import { ExportService } from "src/core/services/export.service";
import { CustomerService } from "../customer/customer.service";
import { CustomerModule } from "../customer/customer.module";

@Module({
  imports: [CommodityModule, CustomerModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    OrderRepository,
    CommodityService,
    CommodityRepository,
    PaymentHistoryRepository,
    PaymentHistoryService,
    ExportService,
    CustomerService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
