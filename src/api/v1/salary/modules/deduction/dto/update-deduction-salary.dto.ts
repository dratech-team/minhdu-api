import { IUpdateSalaryDto } from "../../../../../../common/dtos/update-salary.dto";
import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { OvertimeType } from "../../overtime/overtime-type.enum";
import { Type } from "class-transformer";
import { AbsentType } from "../absent-type.enum";

export class UpdateDeductionSalaryDto extends IUpdateSalaryDto {
  @IsEnum(AbsentType)
  @IsOptional()
  type: OvertimeType;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  times: number;
}
