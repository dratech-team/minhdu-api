import {Module} from '@nestjs/common';
import {LocationService} from './location.service';
import {LocationController} from './location.controller';
import {PrismaService} from "../../../prisma.service";
import {LocationRepository} from "./location.repository";

@Module({
  controllers: [LocationController],
  providers: [LocationService, PrismaService, LocationRepository]
})
export class LocationModule {
}
