import {Module} from '@nestjs/common';
import {HrOverviewService} from './hr-overview.service';
import {HrOverviewController} from './hr-overview.controller';
import {PrismaService} from "../../../prisma.service";
import {HrOverviewRepository} from "./hr-overview.repository";

@Module({
  controllers: [HrOverviewController],
  providers: [PrismaService, HrOverviewService, HrOverviewRepository]
})
export class HrOverviewModule {
}
