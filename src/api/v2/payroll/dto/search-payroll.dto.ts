import {EmployeeType, SalaryType} from "@prisma/client";
import {FilterTypeEnum} from "../entities/filter-type.enum";
import {Transform, Type} from "class-transformer";
import {IsDate, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";

export class SearchPayrollDto {
  @IsOptional()
  @Type(() => Number)
  @Transform(({value}) => Number(value))
  @IsNumber()
  readonly skip: number;

  @IsOptional()
  @Type(() => Number)
  @Transform(({value}) => Number(value))
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
  @Transform(({value}) => new Date(value))
  @IsDate()
  readonly createdAt: Date;

  @IsOptional()
  @Type(() => Date)
  @Transform(({value}) => new Date(value))
  @IsDate()
  readonly startedAt: Date;

  @IsOptional()
  @Type(() => Date)
  @Transform(({value}) => new Date(value))
  @IsDate()
  readonly endedAt: Date;

  @IsOptional()
  @Type(() => Number)
  @Transform(({value}) => +value)
  @IsNumber()
  readonly isConfirm: number;

  @IsOptional()
  @Type(() => Number)
  @Transform(({value}) => +value)
  @IsNumber()
  readonly isPaid: number;

  @IsOptional()
  @IsString()
  readonly salaryTitle: string;

  @IsOptional()
  @Type(() => Number)
  @Transform(({value}) => +value)
  @IsNumber()
  readonly salaryPrice: number;

  @IsOptional()
  @IsEnum(FilterTypeEnum)
  readonly filterType: FilterTypeEnum;

  @IsOptional()
  @IsString()
  readonly type: string;

  @IsOptional()
  @IsString()
  readonly title: string;
}
