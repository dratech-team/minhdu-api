import {OmitType, PartialType} from "@nestjs/mapped-types";
import {CreateManyAbsentDto} from "./create-many-absent.dto";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateManyAbsentDto extends PartialType(OmitType(CreateManyAbsentDto, ["payrollIds"])) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
