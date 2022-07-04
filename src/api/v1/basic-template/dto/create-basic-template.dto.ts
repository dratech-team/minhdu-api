import {SalaryType} from "@prisma/client";
import {Type} from "class-transformer";
import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateBasicTemplateDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(SalaryType)
  readonly type: SalaryType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsOptional()
  @IsArray()
  readonly branchIds: number[];
}
