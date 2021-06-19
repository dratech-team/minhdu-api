import {GenderType} from "@prisma/client";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsPhoneNumber,
  IsString,
  MaxDate,
  MinLength
} from "class-validator";
import {Type} from "class-transformer";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  readonly lastName: string;

  @IsNotEmpty()
  @IsEnum(GenderType)
  readonly gender: GenderType;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('VN')
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('VN')
  readonly workPhone: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: `birthday profile ${ValidatorMessage.datetime}`})
  readonly birthday: Date;

  @IsNotEmpty()
  @IsString()
  readonly birthplace: string

  @IsNotEmpty()
  @IsString()
  readonly identity: string

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: `birthday profile ${ValidatorMessage.datetime}`})
  readonly idCardAt: Date;

  @IsNotEmpty()
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