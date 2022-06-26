import {PartialType} from "@nestjs/mapped-types";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {UpdateSalaryDto} from "./update-salary.dto";

export class UpdateManySalaryDto extends PartialType(UpdateSalaryDto) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  readonly salaryIds: number[];
}
