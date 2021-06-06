import {CreateEmployeeDto} from './create-employee.dto';
import {OmitType, PartialType} from "@nestjs/mapped-types";
import {IsDate, IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdateEmployeeDto extends PartialType(OmitType(CreateEmployeeDto, ['price'] as const)) {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  stayedAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  contractAt: Date;

  @IsOptional()
  @IsNumber()
  salaryId: number;
}
