import {GenderType} from "@prisma/client";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxDate, MaxLength,
  MinLength
} from "class-validator";
import {Transform, Type} from "class-transformer";
import {ValidatorMessage} from "../constant/validator.constant";
import {tomorrowDate} from "../../utils/datetime.util";
import * as moment from "moment";

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Transform((val) => val.value.trim())
  readonly lastName: string;

  @IsNotEmpty()
  @IsEnum(GenderType)
  readonly gender: GenderType;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('VN')
  readonly phone: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('VN')
  readonly workPhone: string;

  @IsNotEmpty()
  @Type(() => Date)
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly birthday: Date;

  @IsOptional()
  @IsString()
  readonly birthplace: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  @MinLength(9)
  readonly identify: string;

  @IsOptional()
  @Type(() => Date)
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly idCardAt: Date;

  @IsOptional()
  @IsString()
  readonly issuedBy: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly wardId: number;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsString()
  readonly religion: string;

  @IsOptional()
  @IsString()
  readonly mst: string;
}
