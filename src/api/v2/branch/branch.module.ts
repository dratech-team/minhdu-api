import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import {PrismaService} from "../../../prisma.service";
import {BranchRepository} from "./branch.repository";

@Module({
  controllers: [BranchController],
  providers: [BranchService, PrismaService, BranchRepository]
})
export class BranchModule {}
