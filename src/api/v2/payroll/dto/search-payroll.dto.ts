import {EmployeeType} from "@prisma/client";
import {FilterTypeEnum} from "../entities/filter-type.enum";
import {Transform, Type} from "class-transformer";
import {IsDate, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import * as moment from "moment";

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
  @Transform(({value}) => {
    if (value) {
      return new Date(moment(value).format('YYYY-MM-DD'));
    }
  })
  @IsDate()
  readonly createdAt: Date;

  @IsOptional()
  @Type(() => Date)
  @Transform(({value}) => {
    if (value) {
      return new Date(moment(value).format('YYYY-MM-DD'));
    }
  })
  @IsDate()
  readonly startedAt: Date;

  @IsOptional()
  @Type(() => Date)
  @Transform(({value}) => {
    if (value) {
      return new Date(moment(value).format('YYYY-MM-DD'));
    }
  })
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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly categoryId: number;
}
