import {Module} from '@nestjs/common';
import {DistrictService} from './district.service';
import {DistrictController} from './district.controller';
import {PrismaService} from "../../../prisma.service";
import {DistrictRepository} from "./district.repository";

@Module({
  controllers: [DistrictController],
  providers: [PrismaService, DistrictService, DistrictRepository]
})
export class DistrictModule {
}
