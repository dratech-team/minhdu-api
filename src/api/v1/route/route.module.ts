import {Module} from '@nestjs/common';
import {RouteService} from './route.service';
import {RouteController} from './route.controller';
import {PrismaService} from "../../../prisma.service";
import {RouteRepository} from "./route.repository";
import {ConfigModule} from "../../../core/config";

@Module({
  imports: [ConfigModule],
  controllers: [RouteController],
  providers: [RouteService, RouteRepository, PrismaService]
})
export class RouteModule {
}
