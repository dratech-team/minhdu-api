import { Module } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { HolidayController } from './holiday.controller';
import {HolidayRepository} from "./holiday.repository";
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [HolidayController],
  providers: [HolidayService, HolidayRepository, PrismaService],
  exports: [HolidayService]
})
export class HolidayModule {}
