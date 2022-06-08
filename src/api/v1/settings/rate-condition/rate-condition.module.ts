import { Module } from '@nestjs/common';
import { RateConditionService } from './rate-condition.service';
import { RateConditionController } from './rate-condition.controller';
import {PrismaService} from "../../../../prisma.service";

@Module({
  controllers: [RateConditionController],
  providers: [RateConditionService, PrismaService]
})
export class RateConditionModule {}
