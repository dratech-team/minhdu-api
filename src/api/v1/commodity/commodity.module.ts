import {forwardRef, Module} from '@nestjs/common';
import {CommodityService} from './commodity.service';
import {CommodityController} from './commodity.controller';
import {PrismaService} from "../../../prisma.service";
import {CommodityRepository} from "./commodity.repository";
import {ConfigModule} from "../../../core/config";
import {OrderHistoryService} from "../histories/order-history/order-history.service";
import {OrderHistoryModule} from "../histories/order-history/order-history.module";
import {OrderModule} from "../order/order.module";
import {OrderRepository} from "../order/order.repository";

@Module({
  imports: [
    ConfigModule,
    OrderHistoryModule,
    forwardRef(() => OrderModule)
  ],
  controllers: [CommodityController],
  providers: [
    CommodityService,
    CommodityRepository,
    PrismaService,
    OrderHistoryService,
    OrderRepository
  ],
  exports: [CommodityService]
})
export class CommodityModule {
}
