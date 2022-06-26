import {OmitType, PartialType} from "@nestjs/mapped-types";
import {CreateManyOvertimeDto} from "./create-many-overtime.dto";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateManyOvertimeDto extends PartialType(OmitType(CreateManyOvertimeDto, ["payrollIds"])) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
