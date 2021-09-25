import { Salary } from "@prisma/client";
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxDate,
} from "class-validator";
import { Type } from "class-transformer";
import { ValidatorMessage } from "../../../../common/constant/validator.constant";
import { tomorrowDate } from "../../../../utils/datetime.util";
import { CreateSalaryDto } from "../../salary/dto/create-salary.dto";

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsNumber()
  readonly employeeId: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MaxDate(tomorrowDate(), { message: ValidatorMessage.datetime })
  readonly createdAt: Date;
}
