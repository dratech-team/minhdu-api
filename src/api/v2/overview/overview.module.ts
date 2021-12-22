import {Module} from '@nestjs/common';
import {OverviewService} from './overview.service';
import {OverviewController} from './overview.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [OverviewController],
  providers: [PrismaService, OverviewService]
})
export class OverviewModule {
}
