import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate} from "class-validator";
import {Type} from "class-transformer";
import {DatetimeUnit, SalaryType} from "@prisma/client";
import {ValidatorMessage} from "../constant/validator.constant";
import {tomorrowDate} from "src/utils/datetime.util";

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
  @IsOptional()
  @MaxDate(tomorrowDate(), {message: ValidatorMessage.datetime})
  readonly datetime?: Date;

  @IsOptional()
  @Type(() => Number)
  readonly times?: number;

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
