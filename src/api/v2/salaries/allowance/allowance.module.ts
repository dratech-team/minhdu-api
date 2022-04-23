import {Module} from '@nestjs/common';
import {AllowanceService} from './allowance.service';
import {AllowanceController} from './allowance.controller';
import {AllowanceRepository} from "./allowance.repository";
import {PrismaService} from "../../../../prisma.service";

@Module({
  controllers: [AllowanceController],
  providers: [AllowanceService, AllowanceRepository, PrismaService]
})
export class AllowanceModule {
}
