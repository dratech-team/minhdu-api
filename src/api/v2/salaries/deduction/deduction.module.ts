import {Module} from '@nestjs/common';
import {DeductionService} from './deduction.service';
import {DeductionController} from './deduction.controller';
import {DeductionRepository} from "./deduction.repository";
import {PrismaService} from "../../../../prisma.service";
import {AbsentService} from "../absent/absent.service";
import {AbsentRepository} from "../absent/absent.repository";

@Module({
  controllers: [DeductionController],
  providers: [DeductionService, DeductionRepository, PrismaService, AbsentRepository, AbsentService]
})
export class DeductionModule {
}
