import {Salary} from "@prisma/client";
import {IsDate, IsNotEmpty, IsNumber, IsOptional, MaxDate} from "class-validator";
import {Type} from "class-transformer";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  @IsOptional()
  salaries: Salary[];

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  createdAt: Date;

}
