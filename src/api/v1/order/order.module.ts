import {Module} from "@nestjs/common";
import {OrderService} from "./order.service";
import {OrderController} from "./order.controller";
import {PrismaService} from "../../../prisma.service";
import {OrderRepository} from "./order.repository";
import {CommodityModule} from "../commodity/commodity.module";
import {PaymentHistoryRepository} from "../histories/payment-history/payment-history.repository";
import {PaymentHistoryService} from "../histories/payment-history/payment-history.service";
import {CustomerModule} from "../customer/customer.module";
import {ConfigModule} from "../../../core/config";

@Module({
  imports: [CommodityModule, CustomerModule, ConfigModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    PrismaService,
    PaymentHistoryRepository,
    PaymentHistoryService,
  ],
  exports: [OrderService],
})
export class OrderModule {
}
