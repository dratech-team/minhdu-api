import {Module} from '@nestjs/common';
import {OvertimeTemplateService} from './overtime-template.service';
import {OvertimeTemplateController} from './overtime-template.controller';
import {PrismaService} from "../../../prisma.service";
import {OvertimeTemplateRepository} from "./overtime-template.repository";
import {ConfigModule} from "../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [OvertimeTemplateController],
  providers: [PrismaService, OvertimeTemplateService, OvertimeTemplateRepository],
  exports: [OvertimeTemplateService, OvertimeTemplateRepository]
})
export class OvertimeTemplateModule {
}
