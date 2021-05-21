import {ICreateUserDto} from "../../../../common/dtos/create-user.dto";
import {Type} from "class-transformer";
import {IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from "class-validator";
import {SalaryType} from "@prisma/client";

export class CreateEmployeeDto extends ICreateUserDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  identify: string;

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

  @Type(() => Boolean)
  @IsOptional()
  isFlatSalary: boolean;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  idCardAt: Date;

}
