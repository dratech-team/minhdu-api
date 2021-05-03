import {ICreateUserDto} from "../../../../common/dtos/create-user.dto";
import {Type} from "class-transformer";
import {IsDate, IsNotEmpty, IsNumber, IsObject, IsString} from "class-validator";

class BasicSalaryDto {

  @IsNotEmpty()
  @IsString()
  title: string;

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

  @IsNotEmpty()
  @IsObject()
  basicSalary: BasicSalaryDto;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  idCardAt: Date;

}
