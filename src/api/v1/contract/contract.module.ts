import {Module} from '@nestjs/common';
import {ContractService} from './contract.service';
import {ContractController} from './contract.controller';
import {PrismaService} from "../../../prisma.service";
import {ContractRepository} from "./contract.repository";

@Module({
  controllers: [ContractController],
  providers: [ContractService, ContractRepository, PrismaService]
})
export class ContractModule {
}
