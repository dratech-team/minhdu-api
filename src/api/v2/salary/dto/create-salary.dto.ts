import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";
import {Type} from "class-transformer";
import {IsEnum, IsNotEmpty, IsNumber, IsOptional, MaxDate} from "class-validator";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";
import {DatetimeUnit} from "@prisma/client";

export class CreateSalaryDto extends ICreateSalaryDto {
  @Type(() => Date)
  @IsOptional()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  datetime: Date;

  @IsOptional()
  @Type(() => Number)
  times: number

  @IsOptional()
  @IsEnum(DatetimeUnit)
  unit: DatetimeUnit;

  @IsOptional()
  @Type(() => Number)
  rate: number;

  @IsOptional()
  @Type(() => Boolean)
  forgot: boolean;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  employeeId: number

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  payrollId: number
}
