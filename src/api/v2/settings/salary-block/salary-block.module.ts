import {Module} from '@nestjs/common';
import {SalaryBlockService} from './salary-block.service';
import {SalaryBlockController} from './salary-block.controller';
import {PrismaService} from "../../../../prisma.service";

@Module({
  controllers: [SalaryBlockController],
  providers: [SalaryBlockService, PrismaService]
})
export class SalaryBlockModule {
}
