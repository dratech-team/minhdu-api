import {Salary} from "@prisma/client";
import {IsDate, IsNotEmpty, IsNumber, IsOptional, MaxDate} from "class-validator";
import {Type} from "class-transformer";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsNumber()
  readonly employeeId: number;

  @IsOptional()
  readonly salaries: Salary[];

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  readonly createdAt: Date;
}
