import {ICreateUserDto} from "../../../../common/dtos/create-user.dto";
import {Type} from "class-transformer";
import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength} from "class-validator";

export class CreateEmployeeDto extends ICreateUserDto {
  id: string;

  salaryId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  @MinLength(9)
  identify: string;

  @IsNumber()
  @IsNotEmpty()
  branchId: number;

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
  @IsNotEmpty()
  workedAt: Date;

  @Type(() => Boolean)
  @IsOptional()
  isFlatSalary: boolean;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  idCardAt: Date;
}
