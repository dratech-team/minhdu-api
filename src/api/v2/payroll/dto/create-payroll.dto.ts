import {SalaryType} from "@prisma/client";
import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(SalaryType)
  type: SalaryType;

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
