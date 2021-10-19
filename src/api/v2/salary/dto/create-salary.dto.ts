import {Type} from "class-transformer";
import {IsArray, IsDate, IsNumber, IsOptional, ValidateNested} from "class-validator";
import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";
import {CreateAllowanceDto} from "./create-allowance.dto";

export class CreateSalaryDto extends ICreateSalaryDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly startedAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly endedAt: Date;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly payrollId?: number;

  @IsOptional()
  @IsArray()
  readonly employeeIds?: number[];

  @IsOptional()
  @IsArray()
  readonly allowEmpIds: number[];

  @ValidateNested()
  readonly allowance: CreateAllowanceDto;
}
