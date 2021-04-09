import { ICreateSalaryDto } from "../../../../../../common/dtos/create-salary.dto";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { OvertimeType } from "../../overtime/overtime-type.enum";
import { Type } from "class-transformer";
import { AbsentType } from "../absent-type.enum";

export class CreateDeductionSalaryDto extends ICreateSalaryDto {
  @IsEnum(AbsentType)
  @IsNotEmpty()
  type: OvertimeType;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  times: number;
}
