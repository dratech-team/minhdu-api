import {ICreateUserDto} from "../../../../common/dtos/create-user.dto";
import {Type} from "class-transformer";
import {IsDate, IsNotEmpty, IsNumber, IsObject, IsString} from "class-validator";
import {Salary} from "@prisma/client";

export class CreateEmployeeDto extends ICreateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  branchId: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  departmentId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  positionId: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  workedAt: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  idCardAt: Date;

  @IsNotEmpty()
  @IsObject()
  basicSalary: Salary;
}
