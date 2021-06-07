import {Salary, SalaryType} from "@prisma/client";
import {IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  salaries: Salary[];

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

}
