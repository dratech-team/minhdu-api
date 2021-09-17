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
import {CustomerModule} from "../customer/customer.module";
import {CustomerRepository} from "../customer/customer.repository";
import {ConfigModule} from "../../../core/config/config.module";

@Module({
  imports: [CommodityModule, CustomerModule, ConfigModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    PrismaService,
    CommodityService,
    CommodityRepository,
    PaymentHistoryRepository,
    PaymentHistoryService,
    CustomerRepository,
  ],
  exports: [OrderService],
})
export class OrderModule {
}
