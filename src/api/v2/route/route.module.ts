import {Module} from '@nestjs/common';
import {RouteService} from './route.service';
import {RouteController} from './route.controller';
import {PrismaService} from "../../../prisma.service";
import {RouteRepository} from "./route.repository";

@Module({
  controllers: [RouteController],
  providers: [RouteService, PrismaService, RouteRepository]
})
export class RouteModule {
}
