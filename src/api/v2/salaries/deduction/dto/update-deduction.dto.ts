import {PartialType} from '@nestjs/mapped-types';
import {CreateDeductionDto} from './create-deduction.dto';
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateDeductionDto extends PartialType(CreateDeductionDto) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
