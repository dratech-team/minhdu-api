import {IsEnum, IsOptional} from "class-validator";
import {SalaryType} from "@prisma/client";

export class SearchSalarySettingsDto {
  @IsOptional()
  @IsEnum(SalaryType)
  readonly salaryType: SalaryType;
}
