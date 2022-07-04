import {Module} from '@nestjs/common';
import {BankService} from './bank.service';
import {BankController} from './bank.controller';
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config";

@Module({
  imports: [ConfigModule],
  controllers: [BankController],
  providers: [PrismaService, BankService]
})
export class BankModule {
}
