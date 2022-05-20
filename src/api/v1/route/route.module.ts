import {Module} from '@nestjs/common';
import {RouteService} from './route.service';
import {RouteController} from './route.controller';
import {PrismaService} from "../../../prisma.service";
import {RouteRepository} from "./route.repository";
import {ConfigModule} from "../../../core/config/config.module";
import {OrderModule} from "../order/order.module";

@Module({
  imports: [ConfigModule, OrderModule],
  controllers: [RouteController],
  providers: [RouteService, PrismaService, RouteRepository]
})
export class RouteModule {
}
