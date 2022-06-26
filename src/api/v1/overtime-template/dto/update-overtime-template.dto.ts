import {PartialType} from '@nestjs/mapped-types';
import {CreateOvertimeTemplateDto} from './create-overtime-template.dto';

export class UpdateOvertimeTemplateDto extends PartialType(CreateOvertimeTemplateDto) {
}
