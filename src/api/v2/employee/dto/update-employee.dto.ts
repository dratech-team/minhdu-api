import {CreateEmployeeDto} from './create-employee.dto';
import {OmitType, PartialType} from "@nestjs/mapped-types";
import {IsDate, IsNumber, IsOptional, MaxDate} from "class-validator";
import {Type} from "class-transformer";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";

export class UpdateEmployeeDto extends PartialType(OmitType(CreateEmployeeDto, ['price'] as const)) {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  stayedAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  contractAt: Date;

  @IsOptional()
  @IsNumber()
  salaryId: number;
}
