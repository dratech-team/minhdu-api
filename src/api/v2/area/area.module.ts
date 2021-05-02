import {Module} from '@nestjs/common';
import {AreaService} from './area.service';
import {AreaController} from './area.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  imports: [],
  controllers: [AreaController],
  providers: [AreaService, PrismaService]
})
export class AreaModule {
}
