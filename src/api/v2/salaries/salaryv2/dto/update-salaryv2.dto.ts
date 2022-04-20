import {PartialType} from '@nestjs/mapped-types';
import {CreateSalaryv2Dto} from './create-salaryv2.dto';
import {IsArray, IsNumber} from "class-validator";

export class UpdateSalaryv2Dto extends PartialType(CreateSalaryv2Dto) {
  @IsArray()
  @IsNumber({}, {each: true})
  readonly salaryIds: number[];
}
