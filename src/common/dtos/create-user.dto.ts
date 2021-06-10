import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString, MaxDate,
  MaxLength,
  MinLength
} from "class-validator";
import {Transform, Type} from "class-transformer";
import {GenderType} from "@prisma/client";
import * as moment from "moment";
import {ValidatorMessage} from "../constant/validator.constant";

export class ICreateUserDto {
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(5, {message: ValidatorMessage.name})
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @MaxLength(200)
  @MinLength(10)
  @IsString()
  readonly address: string;

  @Type(() => Date)
  @Transform(birthday => new Date(birthday.value))
  @IsDate()
  @IsNotEmpty()
  // @MaxDate(
  //   moment(new Date()).subtract(18, 'years').toDate(),
  //   {message: ValidatorMessage.birthday}
  // )
  birthday: Date;

  @IsNotEmpty()
  @IsEnum(GenderType)
  readonly gender: GenderType;

  @IsNotEmpty()
  @IsPhoneNumber("VN", {message: ValidatorMessage.phone})
  readonly phone: string;

  @IsOptional()
  @MaxLength(20)
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly note: string;
}
