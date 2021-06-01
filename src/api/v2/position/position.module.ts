import {Module} from '@nestjs/common';
import {PositionService} from './position.service';
import {PositionController} from './position.controller';
import {PrismaService} from "../../../prisma.service";
import {PositionRepository} from "./position.repository";

@Module({
  controllers: [PositionController],
  providers: [PrismaService, PositionRepository, PositionService]
})
export class PositionModule {
}
