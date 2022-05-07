import {PartialType} from "@nestjs/mapped-types";
import {CreateManyHolidayDto} from "./create-many-holiday.dto";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateManyHolidayDto extends PartialType(CreateManyHolidayDto) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
