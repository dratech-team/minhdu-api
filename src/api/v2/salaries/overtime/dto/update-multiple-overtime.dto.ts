import {OmitType, PartialType} from "@nestjs/mapped-types";
import {CreateMultipleOvertimeDto} from "./create-multiple-overtime.dto";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateMultipleOvertimeDto extends PartialType(OmitType(CreateMultipleOvertimeDto, ["payrollIds"])) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
