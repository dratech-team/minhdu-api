import {Module} from '@nestjs/common';
import {RouteService} from './route.service';
import {RouteController} from './route.controller';
import {PrismaService} from "../../../prisma.service";
import {RouteRepository} from "./route.repository";
import {ConfigModule} from "../../../core/config";
import {OrderModule} from "../order/order.module";
import {OrderRepository} from "../order/order.repository";
import {CommodityModule} from "../commodity/commodity.module";
import {CommodityRepository} from "../commodity/commodity.repository";

@Module({
  imports: [ConfigModule, OrderModule, CommodityModule],
  controllers: [RouteController],
  providers: [
    RouteService,
    RouteRepository,
    PrismaService,
    OrderRepository,
    CommodityRepository
  ]
})
export class RouteModule {
}
