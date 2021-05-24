import {ICreateUserDto} from "../../../../common/dtos/create-user.dto";
import {Type} from "class-transformer";
import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

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
  workday: number;

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
