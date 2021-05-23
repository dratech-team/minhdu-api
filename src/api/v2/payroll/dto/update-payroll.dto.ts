import {CreatePayrollDto} from './create-payroll.dto';
import {IsBoolean, IsObject, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdatePayrollDto {
  @IsOptional()
  @Type(() => Number)
  salaryId: number

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isConfirm: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPaid: boolean;

}
