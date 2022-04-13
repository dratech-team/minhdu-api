import {SalaryReference, SalaryType} from "@prisma/client";
import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateSalarySettingsDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(SalaryType)
  readonly salaryType: SalaryType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly rate: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsOptional()
  @IsEnum(SalaryReference)
  readonly reference: SalaryReference;

  @IsOptional()
  @IsArray()
  readonly constraints: SalaryType[];
}
