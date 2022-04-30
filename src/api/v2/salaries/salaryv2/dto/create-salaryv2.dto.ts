import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {OmitType} from "@nestjs/mapped-types";
import {CreateManySalaryv2Dto} from "./create-many-salaryv2.dto";

export class CreateSalaryv2Dto extends OmitType(CreateManySalaryv2Dto, ["payrollIds"]) {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;
}
