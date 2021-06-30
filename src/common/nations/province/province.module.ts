import {Module} from '@nestjs/common';
import {ProvinceService} from './province.service';
import {ProvinceController} from './province.controller';
import {PrismaService} from "../../../prisma.service";
import {ProvinceRepository} from "./province.repository";

@Module({
  controllers: [ProvinceController],
  providers: [PrismaService, ProvinceService, ProvinceRepository]
})
export class ProvinceModule {
}
