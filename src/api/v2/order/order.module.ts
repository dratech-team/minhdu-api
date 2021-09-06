import {Module} from "@nestjs/common";
import {OrderService} from "./order.service";
import {OrderController} from "./order.controller";
import {PrismaService} from "../../../prisma.service";
import {OrderRepository} from "./order.repository";
import {CommodityModule} from "../commodity/commodity.module";
import {CommodityService} from "../commodity/commodity.service";
import {CommodityRepository} from "../commodity/commodity.repository";
import {PaymentHistoryRepository} from "../payment-history/payment-history.repository";
import {PaymentHistoryService} from "../payment-history/payment-history.service";
import {ExportService} from "src/core/services/export.service";

@Module({
  imports: [CommodityModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    PrismaService,
    CommodityService,
    CommodityRepository,
    PaymentHistoryRepository,
    PaymentHistoryService,
    ExportService,
  ],
  exports: [OrderService],
})
export class OrderModule {
}
