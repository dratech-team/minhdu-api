import {OmitType, PartialType} from "@nestjs/mapped-types";
import {CreateSalaryDto} from "./create-salary.dto";
import {IsArray, IsNumber} from "class-validator";

export class UpdateManySalaryDto extends OmitType(CreateSalaryDto, ["payrollId"]) {
  @IsArray()
  @IsNumber({}, {each: true})
  readonly salaryIds: number[];
}
