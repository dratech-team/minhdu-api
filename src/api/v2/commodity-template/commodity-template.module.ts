import { Module } from '@nestjs/common';
import { CommodityTemplateService } from './commodity-template.service';
import { CommodityTemplateController } from './commodity-template.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [CommodityTemplateController],
  providers: [CommodityTemplateService, PrismaService]
})
export class CommodityTemplateModule {}
