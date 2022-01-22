import {OmitType, PartialType} from "@nestjs/mapped-types";
import {IsDate, IsOptional, IsString,} from "class-validator";
import {CreateEmployeeDto} from "./create-employee.dto";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class UpdateEmployeeDto extends PartialType(OmitType(CreateEmployeeDto, [
  "contract",
])) {
  @IsOptional()
  @IsString()
  readonly zalo?: string;

  @IsOptional()
  @IsString()
  readonly facebook?: string;

  @IsOptional()
  @IsString()
  readonly avt?: string;

  @IsOptional()
  @IsString()
  readonly ethnicity?: string;

  @IsOptional()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  @Type(() => Date)
  @IsDate()
  readonly leftAt?: Date;
}
