import {OmitType} from "@nestjs/mapped-types";
import {CreateMultipleAbsentDto} from "./create-multiple-absent.dto";
import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateAbsentDto extends OmitType(CreateMultipleAbsentDto, ["payrollIds"]) {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;
}
