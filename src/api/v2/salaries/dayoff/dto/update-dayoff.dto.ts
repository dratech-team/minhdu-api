import { PartialType } from '@nestjs/swagger';
import { CreateDayoffDto } from './create-dayoff.dto';

export class UpdateDayoffDto extends PartialType(CreateDayoffDto) {}
