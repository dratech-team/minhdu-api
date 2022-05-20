import {CreateDayoffDto} from "./create-dayoff.dto";
import {OmitType} from "@nestjs/mapped-types";
import {IsArray, IsNumber, IsOptional} from "class-validator";

export class CreateManyDayoffDto extends OmitType(CreateDayoffDto, ["payrollId"]) {
  @IsOptional()
  @IsNumber({}, {each: true})
  @IsArray()
  readonly payrollIds: number[];
}
