import {Module} from "@nestjs/common";
import {OrderService} from "./order.service";
import {OrderController} from "./order.controller";
import {PrismaService} from "../../../prisma.service";
import {OrderRepository} from "./order.repository";
import {PaymentHistoryRepository} from "../histories/payment-history/payment-history.repository";
import {ConfigModule} from "../../../core/config";
import {PaymentHistoryModule} from "../histories/payment-history/payment-history.module";
import {CommodityRepository} from "../commodity/commodity.repository";
import {CommodityModule} from "../commodity/commodity.module";

@Module({
  imports: [ConfigModule, PaymentHistoryModule, CommodityModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    PrismaService,
    PaymentHistoryRepository,
    CommodityRepository
  ],
  exports: [],
})
export class OrderModule {
}
