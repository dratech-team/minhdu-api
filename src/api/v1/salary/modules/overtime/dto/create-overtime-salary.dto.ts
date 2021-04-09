import { ICreateSalaryDto } from "../../../../../../common/dtos/create-salary.dto";
import { IsIn, IsNotEmpty, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { OvertimeType } from "../overtime-type.enum";

export class CreateOvertimeSalaryDto extends ICreateSalaryDto {
  @IsIn([OvertimeType.DAY, OvertimeType.HOUR])
  @IsNotEmpty()
  type: OvertimeType;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  times: number;
}
