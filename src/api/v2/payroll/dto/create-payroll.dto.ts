import {Salary, SalaryType} from "@prisma/client";
import {IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate} from "class-validator";
import {Type} from "class-transformer";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  salaries: Salary[];

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  createdAt: Date;

}
