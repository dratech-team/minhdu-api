import {Module} from '@nestjs/common';
import {DeductionService} from './deduction.service';
import {DeductionController} from './deduction.controller';
import {DeductionRepository} from "./deduction.repository";
import {PrismaService} from "../../../../prisma.service";
import {AbsentService} from "../absent/absent.service";
import {AbsentRepository} from "../absent/absent.repository";
import {ConfigModule} from "../../../../core/config/config.module";
import {AbsentModule} from "../absent/absent.module";

@Module({
  imports: [ConfigModule, AbsentModule],
  controllers: [DeductionController],
  providers: [DeductionService, DeductionRepository, PrismaService, AbsentRepository, AbsentService]
})
export class DeductionModule {
}
