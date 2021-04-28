import {IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional} from "class-validator";
import {ObjectId} from "mongodb";
import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";
import {CreateOvertimeDto} from "./create-overtime.dto";
import {CreateDeductionDto} from "./create-deduction.dto";
import {Type} from "class-transformer";

export class CreatePayrollDto {
  @IsMongoId()
  @IsNotEmpty()
  employeeId: ObjectId;

  @IsOptional()
  @IsArray()
  allowances: ICreateSalaryDto[];

  @IsOptional()
  @IsArray()
  overtimes: CreateOvertimeDto[];

  @IsOptional()
  @IsArray()
  loans: ICreateSalaryDto[];

  @IsOptional()
  @IsArray()
  deductions: CreateDeductionDto[];

  @IsOptional()
  @IsArray()
  others: ICreateSalaryDto[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isEdit: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isConfirmed: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPaidAt: boolean;

}
