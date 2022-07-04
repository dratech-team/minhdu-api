import {Module} from "@nestjs/common";
import {OrderService} from "./order.service";
import {OrderController} from "./order.controller";
import {PrismaService} from "../../../prisma.service";
import {OrderRepository} from "./order.repository";
import {PaymentHistoryRepository} from "../histories/payment-history/payment-history.repository";
import {ConfigModule} from "../../../core/config";
import {PaymentHistoryModule} from "../histories/payment-history/payment-history.module";

@Module({
  imports: [ConfigModule, PaymentHistoryModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    PrismaService,
    PaymentHistoryRepository,
  ],
  exports: [],
})
export class OrderModule {
}
