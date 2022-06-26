import {PartialType} from "@nestjs/mapped-types";
import {CreateManyDeductionDto} from "./create-many-deduction.dto";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateManyDeductionDto extends PartialType(CreateManyDeductionDto) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
