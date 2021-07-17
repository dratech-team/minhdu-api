import { PartialType } from '@nestjs/swagger';
import { CreateStatisticalDto } from './create-statistical.dto';

export class UpdateStatisticalDto extends PartialType(CreateStatisticalDto) {}
