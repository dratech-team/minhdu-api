import {Module} from '@nestjs/common';
import {AllowanceService} from './allowance.service';
import {AllowanceController} from './allowance.controller';
import {AllowanceRepository} from "./allowance.repository";
import {PrismaService} from "../../../../prisma.service";
import {ConfigModule} from "../../../../core/config";

@Module({
  imports: [ConfigModule],
  controllers: [AllowanceController],
  providers: [AllowanceService, AllowanceRepository, PrismaService],
  exports: [AllowanceService]
})
export class AllowanceModule {
}
