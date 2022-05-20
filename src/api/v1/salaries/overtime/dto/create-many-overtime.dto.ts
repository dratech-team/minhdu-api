import {OmitType} from "@nestjs/mapped-types";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {CreateOvertimeDto} from "./create-overtime.dto";

export class CreateManyOvertimeDto extends OmitType(CreateOvertimeDto, ["payrollId"]) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly payrollIds: number[];
}
