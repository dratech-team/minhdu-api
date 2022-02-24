import {Module} from '@nestjs/common';
import {EggService} from './egg.service';
import {EggController} from './egg.controller';
import {PrismaService} from "../../../prisma.service";
import {EggRepository} from "./egg.repository";
import {EggTypeService} from "../egg-type/egg-type.service";

@Module({
  controllers: [EggController],
  providers: [EggService, EggRepository, PrismaService, EggTypeService]
})
export class EggModule {
}
