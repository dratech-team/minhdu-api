import {Module} from '@nestjs/common';
import {OvertimeTemplateService} from './overtime-template.service';
import {OvertimeTemplateController} from './overtime-template.controller';
import {PrismaService} from "../../../prisma.service";
import {OvertimeTemplateRepository} from "./overtime-template.repository";
import {ConfigModule} from "../../../core/config";

@Module({
  imports: [ConfigModule],
  controllers: [OvertimeTemplateController],
  providers: [OvertimeTemplateService, OvertimeTemplateRepository, PrismaService],
  exports: []
})
export class OvertimeTemplateModule {
}
