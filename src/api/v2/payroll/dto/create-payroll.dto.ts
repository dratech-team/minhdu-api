import {SalaryType} from "@prisma/client";
import {IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreatePayrollDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(SalaryType)
  type: SalaryType;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  datetime: Date;

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
