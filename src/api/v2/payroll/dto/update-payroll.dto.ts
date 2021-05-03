import {CreatePayrollDto} from './create-payroll.dto';
import {IsBoolean, IsOptional} from "class-validator";
import {Type} from "class-transformer";
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isConfirm: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPaid: boolean;
}
