import {CreateEmployeeDto} from './create-employee.dto';
import {PartialType} from "@nestjs/mapped-types";
import {IsDate, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  stayedAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  contractAt: Date;
}
