import { OmitType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { ICreateSalaryDto } from "../../../../common/dtos/create-salary.dto";
import { RageDate } from "../entities/salary.entity";
import { CreateAllowanceDto } from "./create-allowance.dto";

export class CreateSalaryDto extends ICreateSalaryDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly payrollId?: number;
}

export class CreateSalaryEmployeesDto extends OmitType(CreateSalaryDto, [
  "payrollId",
]) {
  @IsOptional()
  @IsArray()
  readonly employeeIds?: number[];

  @IsOptional()
  @IsArray()
  readonly allowEmpIds: number[];

  @ValidateNested()
  readonly allowance: CreateAllowanceDto;
}

/// use khi loại tăng ca là ngày. tiền sẽ được công 1 ngày hoặc nhiều ngày
export class CreateSalaryByDayDto extends OmitType(CreateSalaryDto, [
  "datetime",
]) {
  @IsOptional()
  readonly datetime: Date | RageDate | null;
}
