import {IsBoolean, IsOptional} from "class-validator";
import {Type} from "class-transformer";
import {UpdateSalaryPayrollDto} from "./update-salary-payroll.dto";

export class UpdatePayrollDto extends UpdateSalaryPayrollDto {
  @IsOptional()
  @Type(() => Number)
  salaryId: number

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isEdit: boolean

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isConfirm: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPaid: boolean;

}
