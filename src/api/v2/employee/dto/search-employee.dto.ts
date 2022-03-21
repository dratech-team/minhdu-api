import {EmployeeType, GenderType, RecipeType} from "@prisma/client";
import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {OrderbyEmployeeEnum} from "../enums/orderby-employee.enum";
import {SortDto} from "../../../../common/dtos/sort.dto";

export class SearchEmployeeDto  extends SortDto{
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
  @IsOptional()
  readonly isLeft: boolean | string;

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
