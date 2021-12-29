import {PartialType} from "@nestjs/mapped-types";
import {CreateSalaryDto} from "./create-salary.dto";
import {IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdateSalaryDto extends PartialType(CreateSalaryDto) {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly employeeId: number;
}
