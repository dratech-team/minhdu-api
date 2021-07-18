import {Module} from '@nestjs/common';
import {PaymentHistoryService} from './payment-history.service';
import {PaymentHistoryController} from './payment-history.controller';
import {PrismaService} from "../../../prisma.service";
import {PaymentHistoryRepository} from "./payment-history.repository";

@Module({
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService, PrismaService, PaymentHistoryRepository],
  exports: [PaymentHistoryService]
})
export class PaymentHistoryModule {
}
