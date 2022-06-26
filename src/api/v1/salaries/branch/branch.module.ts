import {Module} from '@nestjs/common';
import {BranchService} from './branch.service';
import {BranchController} from './branch.controller';
import {BranchRepository} from "./branch.repository";
import {PrismaService} from "../../../../prisma.service";
import {ConfigModule} from "../../../../core/config";

@Module({
  imports: [ConfigModule],
  controllers: [BranchController],
  providers: [BranchService, BranchRepository, PrismaService]
})
export class BranchModule {
}
