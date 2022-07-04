import {Module} from '@nestjs/common';
import {HolidayService} from './holiday.service';
import {HolidayController} from './holiday.controller';
import {HolidayRepository} from "./holiday.repository";
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config";

@Module({
  imports: [ConfigModule],
  controllers: [HolidayController],
  providers: [HolidayService, HolidayRepository, PrismaService],
  exports: []
})
export class HolidayModule {
}
