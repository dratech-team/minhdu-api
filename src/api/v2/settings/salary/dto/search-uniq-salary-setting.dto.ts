import {IsEnum, IsNotEmpty, IsString} from "class-validator";
import {SalaryType} from "@prisma/client";

export class SearchUniqSalarySettingDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(SalaryType)
  readonly type: SalaryType;
}
