import {PartialType} from "@nestjs/mapped-types";
import {CreatePayrollDto} from "./create-payroll.dto";
import {IsArray, IsOptional} from "class-validator";
import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {
  @IsOptional()
  @IsArray()
  basics: ICreateSalaryDto[];
}