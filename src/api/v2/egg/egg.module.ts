import {Module} from '@nestjs/common';
import {EggService} from './egg.service';
import {EggController} from './egg.controller';
import {PrismaService} from "../../../prisma.service";
import {EggRepository} from "./egg.repository";

@Module({
  controllers: [EggController],
  providers: [EggService, EggRepository, PrismaService]
})
export class EggModule {
}
