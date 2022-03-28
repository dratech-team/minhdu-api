import {IsDate, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Transform} from "class-transformer";
import * as moment from "moment";
import {SalaryType} from "@prisma/client";

export class SearchSalaryDto {
  @IsNotEmpty()
  @IsDate()
  @Transform(val => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(val => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly endedAt: Date;

  @IsOptional()
  @IsString()
  readonly branch: string;

  @IsOptional()
  @IsString()
  readonly position: string;

  @IsOptional()
  @IsEnum(SalaryType)
  readonly salaryType: SalaryType;
}
