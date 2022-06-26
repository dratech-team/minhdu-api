import {Module} from '@nestjs/common';
import {OrgChartService} from './org-chart.service';
import {OrgChartController} from './org-chart.controller';
import {PrismaService} from "../../../prisma.service";
import {OrgChartRepository} from "./org-chart.repository";

@Module({
  controllers: [OrgChartController],
  providers: [OrgChartService, PrismaService, OrgChartRepository]
})
export class OrgChartModule {
}
