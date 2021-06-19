import { Module } from '@nestjs/common';
import { WorkHistoryService } from './work-history.service';
import { WorkHistoryController } from './work-history.controller';
import {WorkHistoryRepository} from "./work-history.repository";
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [WorkHistoryController],
  providers: [PrismaService, WorkHistoryService, WorkHistoryRepository]
})
export class WorkHistoryModule {}
