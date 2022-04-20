import {DatetimeUnit, SalaryType} from "@prisma/client";
import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateSalarySettingsDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(SalaryType)
  readonly settingType: SalaryType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly rate: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsOptional()
  @IsArray()
  readonly types: SalaryType[]

  @IsNotEmpty({message: "Bạn phải chọn buổi", groups: ["absent", "overtime"]})
  @IsEnum(DatetimeUnit, {groups: ["absent", "overtime"]})
  readonly unit: DatetimeUnit;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly workday: number;
}
