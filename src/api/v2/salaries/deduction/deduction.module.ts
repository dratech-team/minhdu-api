import {Module} from '@nestjs/common';
import {DeductionService} from './deduction.service';
import {DeductionController} from './deduction.controller';
import {DeductionRepository} from "./deduction.repository";
import {PrismaService} from "../../../../prisma.service";

@Module({
  controllers: [DeductionController],
  providers: [DeductionService, DeductionRepository, PrismaService]
})
export class DeductionModule {
}
