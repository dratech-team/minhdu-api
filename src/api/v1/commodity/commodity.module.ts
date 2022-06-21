import {Module} from '@nestjs/common';
import {CommodityService} from './commodity.service';
import {CommodityController} from './commodity.controller';
import {PrismaService} from "../../../prisma.service";
import {CommodityRepository} from "./commodity.repository";
import {ConfigModule} from "../../../core/config";
import {OrderHistoryService} from "../histories/order-history/order-history.service";
import {OrderHistoryModule} from "../histories/order-history/order-history.module";

@Module({
  imports: [ConfigModule, OrderHistoryModule],
  controllers: [CommodityController],
  providers: [PrismaService, CommodityService, CommodityRepository, OrderHistoryService],
  exports: [CommodityService]
})
export class CommodityModule {
}
