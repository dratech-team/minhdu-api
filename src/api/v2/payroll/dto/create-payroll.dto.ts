import {IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";
import {RecipeType} from "@prisma/client";

export class CreatePayrollDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly employeeId: number;

  @IsNotEmpty()
  @Type(() => Date)
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  @IsDate()
  readonly createdAt: Date;

  @IsOptional()
  @IsObject()
  readonly branch: string;

  @IsOptional()
  @IsObject()
  readonly position: string;

  @IsOptional()
  @IsEnum(RecipeType)
  readonly recipeType: RecipeType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly workday: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly isFlatSalary: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly taxed: boolean;

  @IsOptional()
  readonly tax: number | null;
}
