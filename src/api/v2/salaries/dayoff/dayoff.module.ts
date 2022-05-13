import {Module} from '@nestjs/common';
import {DayoffService} from './dayoff.service';
import {DayoffController} from './dayoff.controller';
import {DayoffRepository} from "./dayoff.repository";
import {PrismaService} from "../../../../prisma.service";

@Module({
  controllers: [DayoffController],
  providers: [DayoffService, DayoffRepository, PrismaService]
})
export class DayoffModule {
}
