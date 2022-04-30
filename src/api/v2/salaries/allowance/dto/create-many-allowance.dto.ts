import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {CreateAllowanceDto} from "./create-allowance.dto";
import {OmitType} from "@nestjs/mapped-types";

export class CreateManyAllowanceDto extends OmitType(CreateAllowanceDto, ["payrollId"]) {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollIds: number[];
}
