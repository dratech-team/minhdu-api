import { ICreateSalaryDto } from "../../../../common/dtos/create-salary.dto";
import { IsEnum, IsNotEmpty } from "class-validator";
import { OtherType } from "../other-type.enum";

export class CreateOtherSalaryDto extends ICreateSalaryDto {
  @IsEnum(OtherType)
  @IsNotEmpty()
  type: OtherType;
}
