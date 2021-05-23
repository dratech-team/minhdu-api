import {SalaryType} from "@prisma/client";
import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class ICreateSalaryDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(SalaryType)
  type: SalaryType;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  note: string;
}
