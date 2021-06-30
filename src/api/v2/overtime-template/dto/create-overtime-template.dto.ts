import {DatetimeUnit, SalaryType} from "@prisma/client";
import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateOvertimeTemplateDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsEnum(SalaryType)
  readonly type?: SalaryType;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsEnum(DatetimeUnit)
  readonly unit?: DatetimeUnit;

  @IsOptional()
  @IsString()
  readonly note?: DatetimeUnit;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly positionId: number;
}
