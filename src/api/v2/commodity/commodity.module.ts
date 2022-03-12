import {Module} from '@nestjs/common';
import {CommodityService} from './commodity.service';
import {CommodityController} from './commodity.controller';
import {PrismaService} from "../../../prisma.service";
import {CommodityRepository} from "./commodity.repository";
import {ConfigModule} from "../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [CommodityController],
  providers: [CommodityService, PrismaService, CommodityRepository],
  exports: [CommodityService]
})
export class CommodityModule {
}
