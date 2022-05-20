import {IsEnum, IsNotEmpty, IsString} from "class-validator";
import {SalaryType} from "@prisma/client";

export class SearchOneSalarySettingsDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(SalaryType)
  readonly settingType: SalaryType;
}
