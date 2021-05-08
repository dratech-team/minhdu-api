import {SalaryType} from "@prisma/client";
import {IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(SalaryType)
  type: SalaryType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  forgot: boolean;

  @IsOptional()
  @IsNumber()
  times: number;

  @IsOptional()
  @IsNumber()
  rate: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  note: string;
}
