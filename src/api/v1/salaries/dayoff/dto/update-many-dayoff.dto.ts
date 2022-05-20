import {CreateManyDayoffDto} from "./create-many-dayoff.dto";
import {OmitType, PartialType} from "@nestjs/mapped-types";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateManyDayoffDto extends PartialType(OmitType(CreateManyDayoffDto, ["payrollIds"])) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
