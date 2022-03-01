import {Module} from '@nestjs/common';
import {PositionService} from './position.service';
import {PositionController} from './position.controller';
import {PrismaService} from "../../../prisma.service";
import {PositionRepository} from "./position.repository";
import {ConfigModule} from "../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [PositionController],
  providers: [PrismaService, PositionRepository, PositionService],
  exports: [PositionService]
})
export class PositionModule {
}
