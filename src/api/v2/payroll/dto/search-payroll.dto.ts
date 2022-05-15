import {EmployeeType, RecipeType} from "@prisma/client";
import {FilterTypeEnum} from "../entities/filter-type.enum";
import {Transform, Type} from "class-transformer";
import {IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from "class-validator";
import * as moment from "moment";
import {SortDto} from "../../../../common/dtos/sort.dto";
import {StatusEnum} from "../../../../common/enum/status.enum";

export class SearchPayrollDto extends SortDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({}, {each: true})
  readonly skip: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({}, {each: true})
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
      return new Date(moment(value).utc().format('YYYY-MM-DD'));
    }
  })
  @IsDate()
  readonly startedAt: Date;

  @IsOptional()
  @Type(() => Date)
  @Transform(({value}) => {
    if (value) {
      return new Date(moment(value).utc().format('YYYY-MM-DD'));
    }
  })
  @IsDate()
  readonly endedAt: Date;

  @IsNotEmpty()
  @IsEnum(StatusEnum)
  @Type(() => Number)
  readonly empStatus: StatusEnum;

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
    return typeof val.value === 'string' ? Array.of(val.value) : val.value;
  })
  readonly titles: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly categoryId: number;

  @IsOptional()
  @IsEnum(RecipeType)
  readonly recipeType: RecipeType;

  @IsOptional()
  @IsObject()
  readonly options: {
    include?: Partial<{
      employee: boolean,
      salaries: boolean,
      salariesv2: boolean,
      deductions: boolean,
      absents: boolean,
      overtimes: boolean,
      allowances: boolean,
      remotes: boolean,
    }>,
    select?: Partial<{
      employee: boolean,
      salaries: boolean,
      salariesv2: boolean,
      deductions: boolean,
      absents: boolean,
      overtimes: boolean,
      allowances: boolean,
      remotes: boolean,
    }>,
  };
}
