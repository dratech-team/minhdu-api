import {Module} from '@nestjs/common';
import {BillService} from './bill.service';
import {BillController} from './bill.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [BillController],
  providers: [BillService, PrismaService]
})
export class BillModule {
}
