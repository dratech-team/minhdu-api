import {Module} from '@nestjs/common';
import {OrderService} from './order.service';
import {OrderController} from './order.controller';
import {PrismaService} from "../../../prisma.service";
import {OrderRepository} from "./order.repository";
import {CommodityModule} from "../commodity/commodity.module";
import {CommodityService} from "../commodity/commodity.service";
import {CommodityRepository} from "../commodity/commodity.repository";

@Module({
  imports: [CommodityModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService, OrderRepository, CommodityService, CommodityRepository],
  exports: [OrderService],
})
export class OrderModule {
}
