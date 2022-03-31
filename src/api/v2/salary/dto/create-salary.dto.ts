import {Transform, Type} from "class-transformer";
import {IsArray, IsDate, IsNumber, IsOptional, ValidateNested} from "class-validator";
import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";
import {CreateAllowanceDto} from "./create-allowance.dto";
import * as moment from "moment";

export class CreateSalaryDto extends ICreateSalaryDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly startedAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly endedAt: Date;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly payrollId?: number;

  @IsOptional()
  @IsArray()
  readonly payrollIds?: number[];

  @IsOptional()
  @IsArray()
  readonly allowPayrollIds: number[];

  @ValidateNested()
  readonly allowance: CreateAllowanceDto;

  @IsOptional()
  @IsNumber()
  readonly branchId: number;
}
