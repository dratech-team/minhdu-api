import {DatetimeUnit, PartialDay, SalaryType} from "@prisma/client";
import {Transform, Type} from "class-transformer";
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,} from "class-validator";
import {RageDate} from "src/api/v2/salary/entities/salary.entity";

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

  @Type(() => Date)
  @Transform((val) => new Date(val.value))
  @IsDate()
  @IsOptional()
  readonly datetime?: Date | RageDate | null;

  @IsOptional()
  @Type(() => Number)
  times?: number;

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
