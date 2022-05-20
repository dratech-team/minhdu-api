import { PartialType } from '@nestjs/swagger';
import { CreateBasicTemplateDto } from './create-basic-template.dto';

export class UpdateBasicTemplateDto extends PartialType(CreateBasicTemplateDto) {}
