import {OmitType} from "@nestjs/mapped-types";
import {CreateManyOvertimeDto} from "./create-many-overtime.dto";
import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateOvertimeDto extends OmitType(CreateManyOvertimeDto, ["payrollIds"]) {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;
}
