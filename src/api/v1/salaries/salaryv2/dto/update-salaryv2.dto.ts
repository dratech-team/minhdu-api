import {PartialType} from '@nestjs/mapped-types';
import {IsArray, IsNumber} from "class-validator";
import {CreateSalaryv2Dto} from "./create-salaryv2.dto";

export class UpdateSalaryv2Dto extends PartialType(CreateSalaryv2Dto) {
  @IsArray()
  @IsNumber({}, {each: true})
  readonly salaryIds: number[];
}
