import {EmployeeType, SalaryType} from "@prisma/client";
import {FilterTypeEnum} from "../entities/filter-type.enum";
import {Type} from "class-transformer";
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Query} from "@nestjs/common";

export class SearchPayrollDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly skip: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly take: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly employeeId: number;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsEnum(EmployeeType)
  readonly employeeType: EmployeeType;

  @IsOptional()
  @IsString()
  readonly branch: string;

  @IsOptional()
  @IsString()
  readonly position: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly createdAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly startedAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly endedAt: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly isConfirm: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly isPaid: number;

  @IsOptional()
  @IsString()
  readonly salaryTitle: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly salaryPrice: number;

  @IsOptional()
  @IsEnum(SalaryType)
  readonly salaryType: SalaryType;

  @IsOptional()
  @IsEnum(FilterTypeEnum)
  readonly filterType: FilterTypeEnum;
}
