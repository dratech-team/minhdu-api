import { Module } from '@nestjs/common';
import { CommodityService } from './commodity.service';
import { CommodityController } from './commodity.controller';
import {PrismaService} from "../../../prisma.service";
import {CommodityRepository} from "./commodity.repository";

@Module({
  controllers: [CommodityController],
  providers: [CommodityService, PrismaService, CommodityRepository],
  exports: [CommodityService]
})
export class CommodityModule {}
