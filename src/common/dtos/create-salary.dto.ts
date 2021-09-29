import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxDate,
} from "class-validator";
import { Type } from "class-transformer";
import { DatetimeUnit, SalaryType } from "@prisma/client";
import { ValidatorMessage } from "../constant/validator.constant";
import { tomorrowDate } from "src/utils/datetime.util";
import { RageDate } from "src/api/v2/salary/entities/salary.entity";

export class ICreateSalaryDto {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(SalaryType)
  readonly type: SalaryType;

  @IsOptional()
  @IsEnum(DatetimeUnit)
  readonly unit?: DatetimeUnit;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  readonly datetime?:  Date | RageDate | null;;

  @IsOptional()
  @Type(() => Number)
  times?: number;

  @IsOptional()
  @Type(() => Boolean)
  readonly forgot?: boolean;

  @IsOptional()
  @Type(() => Number)
  readonly rate?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsString()
  readonly note?: string;
}
