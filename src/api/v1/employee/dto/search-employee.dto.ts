import {EmployeeType, GenderType, RecipeType} from "@prisma/client";
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import {SortDto} from "../../../../common/dtos/sort.dto";
import {PartialType} from "@nestjs/mapped-types";
import {EmployeeStatusEnum} from "../enums/employee-status.enum";
import * as moment from "moment";

export class SearchEmployeeDto extends PartialType(SortDto) {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly gender: GenderType;

  readonly createdAt: {
    datetime: Date,
    compare: 'gte' | 'lte' | 'in' | 'inMonth',
  };

  @IsOptional()
  @IsDate()
  @Transform(({value}) => {
    if (value) {
      return new Date(moment(value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly workedAt: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly isFlatSalary: number; // 0 | 1

  @IsOptional()
  @IsString()
  readonly branch: string;

  @IsOptional()
  @IsString()
  readonly position: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly positionId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly branchId: number;

  @IsOptional()
  @IsDate()
  @Transform(({value}) => {
    if (value) {
      return new Date(moment(value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly createdPayroll: Date;

  @IsNotEmpty()
  @IsEnum(EmployeeStatusEnum)
  @Type(() => Number)
  readonly status: EmployeeStatusEnum;

  @IsOptional()
  @IsEnum(EmployeeType)
  readonly type: EmployeeType;

  @IsOptional()
  @IsEnum(RecipeType)
  readonly recipeType: RecipeType;

  @IsOptional()
  @IsString()
  readonly province: string;

  @IsOptional()
  @IsString()
  readonly district: string;

  @IsOptional()
  @IsString()
  readonly ward: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly categoryId: number;

  @IsOptional()
  @IsString()
  readonly phone: string;

  @IsOptional()
  @IsString()
  readonly identify: string;

  @IsOptional()
  @IsString()
  readonly address: string;
}
