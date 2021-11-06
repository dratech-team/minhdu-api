import {Module} from '@nestjs/common';
import {BranchService} from './branch.service';
import {BranchController} from './branch.controller';
import {PrismaService} from "../../../prisma.service";
import {BranchRepository} from "./branch.repository";
import {ConfigModule} from "../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [BranchController],
  providers: [BranchService, BranchRepository, PrismaService],
  exports: [BranchService]
})
export class BranchModule {
}
