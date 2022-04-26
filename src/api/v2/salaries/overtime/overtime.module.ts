import {Module} from '@nestjs/common';
import {OvertimeService} from './overtime.service';
import {OvertimeController} from './overtime.controller';
import {ConfigModule} from "../../../../core/config/config.module";
import {PrismaService} from "../../../../prisma.service";
import {OvertimeRepository} from "./overtime.repository";
import {SalarySettingsService} from "../../settings/salary/salary-settings.service";
import {SalarySettingsRepository} from "../../settings/salary/salary-settings.repository";

@Module({
  imports: [ConfigModule],
  controllers: [OvertimeController],
  providers: [
    PrismaService,
    OvertimeService,
    OvertimeRepository,
    SalarySettingsService,
    SalarySettingsRepository
  ]
})
export class OvertimeModule {
}
