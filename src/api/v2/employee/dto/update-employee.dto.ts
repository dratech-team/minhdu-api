import {OmitType} from "@nestjs/mapped-types";
import {IsOptional, IsString,} from "class-validator";
import {CreateEmployeeDto} from "./create-employee.dto";

export class UpdateEmployeeDto extends OmitType(CreateEmployeeDto, [
  "contract",
]) {
  @IsOptional()
  @IsString()
  readonly zalo?: string;

  @IsOptional()
  @IsString()
  readonly facebook?: string;

  @IsOptional()
  @IsString()
  readonly avt?: string;

  @IsOptional()
  @IsString()
  readonly ethnicity?: string;
}
