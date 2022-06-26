import { PartialType } from '@nestjs/mapped-types';
import { CreateAbsentDto } from './create-absent.dto';
import {IsArray, IsNumber} from "class-validator";

export class UpdateAbsentDto extends PartialType(CreateAbsentDto) {
  @IsArray()
  @IsNumber({}, {each: true})
  readonly salaryIds: number[];
}
