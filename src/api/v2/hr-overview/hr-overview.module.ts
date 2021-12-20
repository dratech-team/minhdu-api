import {Module} from '@nestjs/common';
import {HrOverviewService} from './hr-overview.service';
import {HrOverviewController} from './hr-overview.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [HrOverviewController],
  providers: [PrismaService, HrOverviewService]
})
export class HrOverviewModule {
}
