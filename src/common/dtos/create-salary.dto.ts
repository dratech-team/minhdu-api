import {DatetimeUnit, PartialDay, SalaryType} from "@prisma/client";
import {Transform, Type} from "class-transformer";
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,} from "class-validator";
import {RageDate} from "src/api/v1/salaries/salary/entities/salary.entity";
import * as moment from "moment";

export class ICreateSalaryDto {
  @IsNotEmpty({message: "Tiêu đề không được để trống"})
  @IsString()
  readonly title: string;

  @IsNotEmpty({message: "loại tiền không được để trống"})
  @IsEnum(SalaryType)
  readonly type: SalaryType;

  @IsOptional()
  @IsEnum(DatetimeUnit)
  readonly unit?: DatetimeUnit;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly datetime?: Date | RageDate | null;

  @IsOptional()
  @Type(() => Number)
  readonly times?: number;

  @IsOptional()
  @Type(() => Boolean)
  readonly forgot?: boolean;

  @IsOptional()
  @IsEnum(PartialDay)
  readonly partial?: PartialDay;

  @IsOptional()
  @Type(() => Number)
  readonly rate?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly price?: number;

  @IsOptional()
  @IsString()
  readonly note?: string;
}
