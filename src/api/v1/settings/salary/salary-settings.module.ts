import {Module} from '@nestjs/common';
import {SalarySettingsService} from './salary-settings.service';
import {SalarySettingsController} from "./salary-settings.controller";
import {SalarySettingsRepository} from "./salary-settings.repository";
import {PrismaService} from "../../../../prisma.service";
import {ConfigModule} from "../../../../core/config";

@Module({
  imports: [ConfigModule],
  controllers: [SalarySettingsController],
  providers: [SalarySettingsService, SalarySettingsRepository, PrismaService]
})
export class SalarySettingsModule {
}
