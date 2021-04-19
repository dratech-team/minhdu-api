import {ICreateSalaryDto} from "../../../../../../common/dtos/create-salary.dto";
import {IsEnum, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {AbsentType} from "../absent-type.enum";

export class CreateDeductionSalaryDto extends ICreateSalaryDto {
  @IsEnum(AbsentType)
  @IsNotEmpty()
  type: AbsentType;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  times: number;
}
