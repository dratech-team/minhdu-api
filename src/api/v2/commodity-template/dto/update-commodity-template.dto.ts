import { PartialType } from '@nestjs/swagger';
import { CreateCommodityTemplateDto } from './create-commodity-template.dto';

export class UpdateCommodityTemplateDto extends PartialType(CreateCommodityTemplateDto) {}
