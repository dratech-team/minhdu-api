import {Module} from '@nestjs/common';
import {SalaryBlockService} from './salary-block.service';
import {SalaryBlockController} from './salary-block.controller';
import {PrismaService} from "../../../../prisma.service";
import {ConfigModule} from "../../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [SalaryBlockController],
  providers: [SalaryBlockService, PrismaService]
})
export class SalaryBlockModule {
}
