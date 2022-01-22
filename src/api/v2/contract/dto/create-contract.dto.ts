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
import {Transform, Type} from "class-transformer";
import { ValidatorMessage } from "../../../../common/constant/validator.constant";
import { tomorrowDate } from "../../../../utils/datetime.util";
import * as moment from "moment";

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
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly createdAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly expiredAt: Date;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  employeeId: number;
}
