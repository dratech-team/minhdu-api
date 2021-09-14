import {HttpModule} from "@nestjs/axios";
import {Module} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {ProvinceController} from "./province.controller";
import {ProvinceRepository} from "./province.repository";
import {ProvinceService} from "./province.service";

@Module({
  imports: [HttpModule],
  controllers: [ProvinceController],
  providers: [
    PrismaService,
    ProvinceService,
    ProvinceRepository,
  ],
})
export class ProvinceModule {
}
