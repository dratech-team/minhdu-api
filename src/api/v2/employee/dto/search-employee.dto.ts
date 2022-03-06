import {EmployeeType, GenderType, RecipeType} from "@prisma/client";
import {IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {SortEnum} from "../../../../common/enum/sort.enum";
import {OrderbyEmployeeEnum} from "../enums/orderby-employee.enum";

export class SearchEmployeeDto {
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
  gender: GenderType;

  createdAt: {
    datetime: Date,
    compare: 'gte' | 'lte' | 'in',
  };

  @IsOptional()
  workedAt: Date;

  isFlatSalary: boolean; // 0 | 1
  branch: string;
  branchId: number;
  position: string;
  positionId: number;
  templateId: number;
  createdPayroll: Date;

  @IsNotEmpty()
  @IsOptional()
  readonly isLeft: boolean | string;

  type: EmployeeType;
  recipeType: RecipeType;
  province: string;
  district: string;
  ward: string;
  categoryId: number;

  @IsOptional()
  @IsEnum(SortEnum)
  readonly orderType: SortEnum;

  @IsOptional()
  @IsEnum(OrderbyEmployeeEnum)
  readonly orderBy: OrderbyEmployeeEnum
}
