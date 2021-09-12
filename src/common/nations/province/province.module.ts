import {Module} from '@nestjs/common';
import {ProvinceService} from './province.service';
import {ProvinceController} from './province.controller';
import {PrismaService} from "../../../prisma.service";
import {ProvinceRepository} from "./province.repository";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [ProvinceController],
  providers: [PrismaService, ProvinceService, ProvinceRepository]
})
export class ProvinceModule {
}
