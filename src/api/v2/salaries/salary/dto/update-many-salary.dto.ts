import {PartialType} from "@nestjs/mapped-types";
import {CreateSalaryDto} from "./create-salary.dto";
import {IsArray, IsBoolean, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdateManySalaryDto extends PartialType(CreateSalaryDto) {
  @IsOptional()
  @IsArray()
  readonly salaryIds: number[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly allowanceDeleted: boolean;
}
