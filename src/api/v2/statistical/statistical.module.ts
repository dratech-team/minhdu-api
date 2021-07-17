import {Module} from '@nestjs/common';
import {StatisticalService} from './statistical.service';
import {StatisticalController} from './statistical.controller';
import {PrismaService} from "../../../prisma.service";
import {StatisticalRepository} from "./statistical.repository";

@Module({
  controllers: [StatisticalController],
  providers: [StatisticalService, PrismaService, StatisticalRepository]
})
export class StatisticalModule {
}
