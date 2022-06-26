import {IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import {CreatePayrollDto} from "./create-payroll.dto";
import {PartialType} from "@nestjs/mapped-types";
import {RecipeType} from "@prisma/client";
import * as moment from "moment";

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {
  @IsOptional()
  @Type(() => Number)
  readonly salaryId?: number

  /// TODO: Tạo endpoint mới cho việc này
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly accConfirmedAt?: Date;

  /// TODO: Tạo endpoint mới cho việc này
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly manConfirmedAt?: Date;

  @IsOptional()
  @Type(() => Number)
  readonly branchId?: number;

  @IsOptional()
  @Type(() => Number)
  readonly positionId?: number;

  @IsOptional()
  @Type(() => Number)
  readonly workday?: number;

  @IsOptional()
  @Type(() => Boolean)
  readonly isFlatSalary?: boolean;

  @IsOptional()
  @IsEnum(RecipeType)
  readonly recipeType?: RecipeType;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly paidAt?: Date;


  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly tax?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly taxed?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly isEdit?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly total?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly actualday?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly absent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly bsc?: number;

  @IsOptional()
  @IsString()
  readonly note?: string;
}
