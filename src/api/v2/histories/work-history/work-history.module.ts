import {Module} from '@nestjs/common';
import {WorkHistoryService} from './work-history.service';
import {WorkHistoryRepository} from "./work-history.repository";
import {PrismaService} from "../../../../prisma.service";

@Module({
  providers: [PrismaService, WorkHistoryService, WorkHistoryRepository],
  exports: [WorkHistoryService]
})
export class WorkHistoryModule {
}
