import { ContractType } from "@prisma/client";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxDate,
} from "class-validator";
import { Type } from "class-transformer";
import { ValidatorMessage } from "../../../../common/constant/validator.constant";
import { tomorrowDate } from "../../../../utils/datetime.util";

export class CreateContractDto {
  @IsOptional()
  @IsEnum(ContractType)
  readonly type: ContractType;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  position: string;

  @Type(() => Date)
  @IsDate()
  readonly createdAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly expiredAt: Date;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  employeeId: number;
}
