import { PartialType } from '@nestjs/mapped-types';
import { CreateMultipleOvertimeDto } from './create-multiple-overtime.dto';

export class UpdateOvertimeDto extends PartialType(CreateMultipleOvertimeDto) {}
