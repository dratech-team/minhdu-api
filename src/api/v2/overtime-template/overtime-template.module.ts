import {Module} from '@nestjs/common';
import {OvertimeTemplateService} from './overtime-template.service';
import {OvertimeTemplateController} from './overtime-template.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [OvertimeTemplateController],
  providers: [PrismaService, OvertimeTemplateService]
})
export class OvertimeTemplateModule {
}
