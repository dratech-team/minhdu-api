import {OmitType, PartialType} from "@nestjs/mapped-types";
import {CreateMultipleAbsentDto} from "./create-multiple-absent.dto";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateMultipleAbsentDto extends PartialType(OmitType(CreateMultipleAbsentDto, ["payrollIds"])) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
