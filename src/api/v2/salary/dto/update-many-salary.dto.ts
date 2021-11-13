import {PartialType} from "@nestjs/mapped-types";
import {CreateSalaryDto} from "./create-salary.dto";
import {IsArray, IsOptional} from "class-validator";

export class UpdateManySalaryDto extends PartialType(CreateSalaryDto) {
  @IsOptional()
  @IsArray()
  readonly salaryIds: number[];
}
