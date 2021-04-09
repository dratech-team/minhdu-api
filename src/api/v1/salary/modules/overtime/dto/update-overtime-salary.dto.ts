import { IUpdateSalaryDto } from "../../../../../../common/dtos/update-salary.dto";
import { IsEnum, IsIn, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { OvertimeType } from "../overtime-type.enum";

export class UpdateOvertimeSalaryDto extends IUpdateSalaryDto {
  @IsIn([OvertimeType.DAY, OvertimeType.HOUR])
  @IsOptional()
  type: OvertimeType;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  times: number;
}
