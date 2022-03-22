import {EmployeeType} from "@prisma/client";
import {FilterTypeEnum} from "../entities/filter-type.enum";
import {Transform, Type} from "class-transformer";
import {IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import * as moment from "moment";
import {SortDto} from "../../../../common/dtos/sort.dto";

export class SearchPayrollDto extends SortDto {
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
  @IsNumber()
  @Type(() => Number)
  readonly templateId: number;

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
  @IsBoolean()
  @Transform((val) => {
    return val.value === 'true';

  })
  readonly isLeave: boolean;

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
  @IsArray()
  @Transform(val => {
    return Array.of(val.value);
  })
  readonly titles: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly categoryId: number;
}
