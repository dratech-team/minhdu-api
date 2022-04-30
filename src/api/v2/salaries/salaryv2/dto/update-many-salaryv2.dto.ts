import {OmitType, PartialType} from "@nestjs/mapped-types";
import {CreateSalaryv2Dto} from "./create-salaryv2.dto";
import {IsArray, IsNumber} from "class-validator";

export class UpdateManySalaryv2Dto extends OmitType(CreateSalaryv2Dto, ["payrollId"]) {
  @IsArray()
  @IsNumber({}, {each: true})
  readonly salaryIds: number[];
}
