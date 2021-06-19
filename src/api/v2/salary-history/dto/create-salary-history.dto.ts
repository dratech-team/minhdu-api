import {SalaryType} from "@prisma/client";
import {Type} from "class-transformer";
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate} from "class-validator";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";

export class CreateSalaryHistoryDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  readonly createdAt: Date;

  @IsOptional()
  @IsString()
  readonly explain: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly branchId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly departmentId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly positionId: number;


  @IsOptional()
  @IsString()
  readonly title: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(SalaryType)
  readonly type: SalaryType;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly employeeId: number;
}
