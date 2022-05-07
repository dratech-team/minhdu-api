import {CreateHolidayDto} from "./create-holiday.dto";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {OmitType} from "@nestjs/mapped-types";

export class CreateManyHolidayDto extends OmitType(CreateHolidayDto, ["payrollId"]) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly payrollIds: number[];
}
