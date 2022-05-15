import {IsArray, IsNumber, IsOptional} from "class-validator";
import {OmitType} from "@nestjs/mapped-types";
import {CreateAbsentDto} from "./create-absent.dto";

export class CreateManyAbsentDto extends OmitType(CreateAbsentDto, ["payrollId"]) {
  @IsOptional()
  @IsNumber({}, {each: true})
  @IsArray()
  readonly payrollIds: number[];
}
