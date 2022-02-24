import {Module} from '@nestjs/common';
import {EggTypeService} from './egg-type.service';
import {EggTypeController} from './egg-type.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [EggTypeController],
  providers: [EggTypeService, PrismaService]
})
export class EggTypeModule {
}
