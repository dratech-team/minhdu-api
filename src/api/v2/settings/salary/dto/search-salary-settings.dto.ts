import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {SalaryType} from "@prisma/client";
import {Type} from "class-transformer";

export class SearchSalarySettingsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsArray()
  @IsEnum(SalaryType, {each: true})
  readonly types: SalaryType[];
}
