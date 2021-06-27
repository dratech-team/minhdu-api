import {Module} from '@nestjs/common';
import {SystemHistoryService} from './system-history.service';
import {PrismaService} from "../../../prisma.service";

@Module({
  providers: [PrismaService, SystemHistoryService],
  exports: [SystemHistoryService]
})
export class SystemHistoryModule {
}
