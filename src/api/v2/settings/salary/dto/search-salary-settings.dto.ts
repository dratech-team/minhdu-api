import {IsArray, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {SalaryType} from "@prisma/client";
import {Transform, Type} from "class-transformer";

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
  @IsString()
  readonly search: string;

  @IsOptional()
  @IsArray()
  @IsEnum(SalaryType, {each: true})
  @Transform(({value}) => {
    if (typeof value === 'string') {
      return Array.of(value);
    }
    return value;
  })
  readonly types: SalaryType[];
}
