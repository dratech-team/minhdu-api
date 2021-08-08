import {Module} from '@nestjs/common';
import {OrderService} from './order.service';
import {OrderController} from './order.controller';
import {PrismaService} from "../../../prisma.service";
import {OrderRepository} from "./order.repository";
import {CommodityModule} from "../commodity/commodity.module";
import {CommodityService} from "../commodity/commodity.service";
import {CommodityRepository} from "../commodity/commodity.repository";
import {PaymentHistoryRepository} from "../payment-history/payment-history.repository";
import {PaymentHistoryService} from "../payment-history/payment-history.service";

@Module({
  imports: [CommodityModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService, OrderRepository, CommodityService, CommodityRepository, PaymentHistoryRepository, PaymentHistoryService],
  exports: [OrderService],
})
export class OrderModule {
}