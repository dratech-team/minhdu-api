import { IsEnum, IsNotEmpty } from "class-validator";
import { OtherType } from "../other-type.enum";
import { Optional } from "@nestjs/common";
import { IUpdateSalaryDto } from "../../../../../../common/dtos/update-salary.dto";

export class UpdateOtherSalaryDto extends IUpdateSalaryDto {
  @IsEnum(OtherType)
  @IsNotEmpty()
  @Optional()
  type: OtherType;
}
