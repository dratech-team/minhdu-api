import {OmitType} from "@nestjs/mapped-types";
import {CreateMultipleOvertimeDto} from "./create-multiple-overtime.dto";
import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateOvertimeDto extends OmitType(CreateMultipleOvertimeDto, ["payrollIds"]) {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;
}
