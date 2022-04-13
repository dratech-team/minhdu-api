import {SalaryConstraint, SalaryType} from "@prisma/client";
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

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly workday: number;

  @IsOptional()
  @IsArray()
  readonly constraints: SalaryConstraint[];
}
