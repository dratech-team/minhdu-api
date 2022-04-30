import {OmitType} from "@nestjs/mapped-types";
import {CreateManyAbsentDto} from "./create-many-absent.dto";
import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateAbsentDto extends OmitType(CreateManyAbsentDto, ["payrollIds"]) {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;
}
