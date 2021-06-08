import {ICreateUserDto} from "../../../../common/dtos/create-user.dto";
import {Type} from "class-transformer";
import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate, MaxLength, Min, MinLength} from "class-validator";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";

export class CreateEmployeeDto extends ICreateUserDto {
  code: string;

  salaryId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(12, {message: ValidatorMessage.identify})
  @MinLength(9, {message: ValidatorMessage.identify})
  identify: string;

  @IsOptional()
  @IsString()
  avt: string;

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
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
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

  @IsOptional()
  @IsString()
  certificate: string;

  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  @IsNotEmpty()
  idCardAt: Date;
}
