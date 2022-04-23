import { PartialType } from '@nestjs/mapped-types';
import { CreateDeductionDto } from './create-deduction.dto';

export class UpdateDeductionDto extends PartialType(CreateDeductionDto) {}
