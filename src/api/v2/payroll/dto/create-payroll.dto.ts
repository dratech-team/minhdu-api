import {Salary} from "@prisma/client";
import {IsArray, IsNotEmpty, IsObject, IsString} from "class-validator";

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsObject()
  salaries: Salary;


}
