import {IsArray, ValidateNested} from "class-validator";
import {CreateSalaryDto} from "./create-salary.dto";

export class CreateForEmployeesDto {
  @ValidateNested()
  readonly salary: CreateSalaryDto;

  @IsArray()
  readonly payrollIds: number[];
}
