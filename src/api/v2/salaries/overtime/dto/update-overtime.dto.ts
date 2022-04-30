import { PartialType } from '@nestjs/mapped-types';
import { CreateManyOvertimeDto } from './create-many-overtime.dto';

export class UpdateOvertimeDto extends PartialType(CreateManyOvertimeDto) {}
