import {Module} from '@nestjs/common';
import {PositionService} from './position.service';
import {PositionController} from './position.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [PositionController],
  providers: [PositionService, PrismaService]
})
export class PositionModule {
}
