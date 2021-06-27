import {CreateEmployeeDto} from './create-employee.dto';
import {PartialType} from "@nestjs/mapped-types";
import {Type} from "class-transformer";
import {IsDate, IsNumber, IsOptional, MaxDate, ValidateNested} from "class-validator";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";
import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  @MaxDate(new Date(), {message: `leftAT ${ValidatorMessage.datetime}`})
  readonly leftAt?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly salaryId?: number;
}
