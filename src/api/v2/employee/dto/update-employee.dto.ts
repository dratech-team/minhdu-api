import {CreateEmployeeDto} from './create-employee.dto';
import {PartialType} from "@nestjs/mapped-types";
import {Type} from "class-transformer";
import {IsDate, IsNumber, IsOptional, IsString, MaxDate, ValidateNested} from "class-validator";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";
import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";
import {tomorrowDate} from "../../../../utils/datetime.util";

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  @MaxDate(tomorrowDate(), {message: `leftAT ${ValidatorMessage.datetime}`})
  readonly leftAt?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly salaryId?: number;

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
