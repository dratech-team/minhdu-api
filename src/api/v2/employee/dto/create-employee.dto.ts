import {ICreateUserDto} from "../../../../common/dtos/create-user.dto";
import {Type} from "class-transformer";
import {IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from "class-validator";
import {SalaryType} from "@prisma/client";

class BasicSalaryDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(SalaryType)
  type: SalaryType;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  note: string;
}

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
