import { OmitType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MaxDate,
} from "class-validator";
import { ValidatorMessage } from "../../../../common/constant/validator.constant";
import { tomorrowDate } from "../../../../utils/datetime.util";
import { CreateEmployeeDto } from "./create-employee.dto";

export class UpdateEmployeeDto extends OmitType(CreateEmployeeDto, [
  "contract",
]) {
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  @MaxDate(tomorrowDate(), { message: `leftAT ${ValidatorMessage.datetime}` })
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
