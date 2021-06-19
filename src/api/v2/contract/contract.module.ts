import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import {PrismaService} from "../../../prisma.service";
import {ContractRepository} from "./contract.repository";

@Module({
  controllers: [ContractController],
  providers: [PrismaService, ContractService, ContractRepository]
})
export class ContractModule {}
