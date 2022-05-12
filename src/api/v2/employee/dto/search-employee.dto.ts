import {EmployeeType, GenderType, RecipeType} from "@prisma/client";
import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {SortDto} from "../../../../common/dtos/sort.dto";
import {PartialType} from "@nestjs/mapped-types";
import {StatusEnum} from "../../../../common/enum/status.enum";
import {EmployeeStatusEnum} from "../enums/employee-status.enum";

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
  readonly workedAt: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly isFlatSalary: number; // 0 | 1

  readonly branch: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly branchId: number;

  readonly position: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly positionId: number;

  readonly createdPayroll: Date;

  @IsNotEmpty()
  @IsEnum(EmployeeStatusEnum)
  @Type(() => Number)
  readonly status: EmployeeStatusEnum;

  readonly type: EmployeeType;

  readonly recipeType: RecipeType;

  readonly province: string;

  readonly district: string;

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
  readonly address: string;
}
