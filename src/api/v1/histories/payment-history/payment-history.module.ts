import {Module} from "@nestjs/common";
import {PrismaService} from "../../../../prisma.service";
import {PaymentHistoryController} from "./payment-history.controller";
import {PaymentHistoryRepository} from "./payment-history.repository";
import {PaymentHistoryService} from "./payment-history.service";
import {ConfigModule} from "../../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService, PaymentHistoryRepository, PrismaService],
  exports: [PaymentHistoryService],
})
export class PaymentHistoryModule {
}
