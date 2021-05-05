import {SalaryType} from "@prisma/client";
import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class ICreateSalaryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(SalaryType)
  type: SalaryType;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  note: string;
}
