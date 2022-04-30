import {OmitType} from "@nestjs/mapped-types";
import {CreateManyAllowanceDto} from "./create-many-allowance.dto";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateManyAllowanceDto extends OmitType(CreateManyAllowanceDto, ["payrollIds"]) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
