import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { ICreateSalaryDto } from "../../../../common/dtos/create-salary.dto";
import { CreateAllowanceDto } from "./create-allowance.dto";

export class CreateSalaryDto extends ICreateSalaryDto {
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
