import { PartialType } from '@nestjs/swagger';
import { CreateIncubatorDto } from './create-incubator.dto';

export class UpdateIncubatorDto extends PartialType(CreateIncubatorDto) {}
