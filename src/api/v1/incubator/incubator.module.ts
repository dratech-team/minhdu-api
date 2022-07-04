import {Module} from '@nestjs/common';
import {IncubatorService} from './incubator.service';
import {IncubatorController} from './incubator.controller';
import {PrismaService} from "../../../prisma.service";
import {IncubatorRepository} from "./incubator.repository";

@Module({
  controllers: [IncubatorController],
  providers: [IncubatorService, IncubatorRepository, PrismaService]
})
export class IncubatorModule {
}
