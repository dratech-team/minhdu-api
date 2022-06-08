import { PartialType } from '@nestjs/swagger';
import { CreateRateConditionDto } from './create-rate-condition.dto';

export class UpdateRateConditionDto extends PartialType(CreateRateConditionDto) {}
