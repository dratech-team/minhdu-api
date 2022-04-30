import {CreateDeductionDto} from "./create-deduction.dto";
import {OmitType} from "@nestjs/mapped-types";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateManyDeductionDto extends OmitType(CreateDeductionDto, ["payrollId"]) {
  @IsNotEmpty()
  @IsNumber({}, {each: true})
  @IsArray()
  @Type(() => Number)
  readonly payrollIds: number[];
}
