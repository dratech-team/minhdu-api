import {Module} from "@nestjs/common";
import {CustomerService} from "./customer.service";
import {CustomerController} from "./customer.controller";
import {PrismaService} from "../../../prisma.service";
import {CustomerRepository} from "./customer.repository";
import {PaymentHistoryModule} from "../payment-history/payment-history.module";
import {PaymentHistoryService} from "../payment-history/payment-history.service";
import {OrderService} from "../order/order.service";
import {PaymentHistoryRepository} from "../payment-history/payment-history.repository";
import {OrderRepository} from "../order/order.repository";
import {CommodityService} from "../commodity/commodity.service";
import {CommodityRepository} from "../commodity/commodity.repository";

@Module({
  imports: [PaymentHistoryModule],
  controllers: [CustomerController],
  providers: [
    PrismaService,
    CustomerService,
    CustomerRepository,
    PaymentHistoryService,
    PaymentHistoryRepository,
    OrderService,
    OrderRepository,
    CommodityService,
    CommodityRepository,
  ],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {
}
