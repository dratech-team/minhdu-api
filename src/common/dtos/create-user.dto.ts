import {IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength} from "class-validator";
import {Type} from "class-transformer";
import {GenderType} from "@prisma/client";

export class ICreateUserDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @MaxLength(200)
  @IsString()
  readonly address: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly birthday: Date;

  @IsNotEmpty()
  @IsEnum(GenderType)
  readonly gender: GenderType;

  @IsNotEmpty()
  @IsPhoneNumber("VN")
  readonly phone: string;

  @IsOptional()
  @MaxLength(100)
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly note: string;
}
