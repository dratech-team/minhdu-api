import {Module} from '@nestjs/common';
import {HolidayService} from './holiday.service';
import {HolidayController} from './holiday.controller';
import {ConfigModule} from "../../../../core/config/config.module";
import {HolidayRepository} from "./holiday.repository";
import {PrismaService} from "../../../../prisma.service";

@Module({
  imports: [ConfigModule],
  controllers: [HolidayController],
  providers: [HolidayService, HolidayRepository, PrismaService]
})
export class HolidayModule {
}
