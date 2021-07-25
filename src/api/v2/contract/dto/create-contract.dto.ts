import {ContractType} from "@prisma/client";
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate} from "class-validator";
import {Type} from "class-transformer";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";

export class CreateContractDto {
  @IsNotEmpty()
  @IsString()
  readonly contractId: string;

  @IsNotEmpty()
  @IsEnum(ContractType)
  readonly type: ContractType;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly position: string;

  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  readonly createdAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  readonly expiredAt: Date;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  employeeId: number;
}
