import {Module} from "@nestjs/common";
import {CustomerService} from "./customer.service";
import {CustomerController} from "./customer.controller";
import {PrismaService} from "../../../prisma.service";
import {CustomerRepository} from "./customer.repository";
import {PaymentHistoryModule} from "../histories/payment-history/payment-history.module";
import {PaymentHistoryService} from "../histories/payment-history/payment-history.service";
import {PaymentHistoryRepository} from "../histories/payment-history/payment-history.repository";
import {CommodityService} from "../commodity/commodity.service";
import {CommodityRepository} from "../commodity/commodity.repository";
import {ConfigModule} from "../../../core/config/config.module";

@Module({
  imports: [PaymentHistoryModule, ConfigModule],
  controllers: [CustomerController],
  providers: [
    PrismaService,
    CustomerService,
    CustomerRepository,
    PaymentHistoryService,
    PaymentHistoryRepository,
    CommodityService,
    CommodityRepository,
  ],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {
}
