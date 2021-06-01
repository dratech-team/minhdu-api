import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";
import {Transform, Type} from "class-transformer";
import {GenderType} from "@prisma/client";

export class ICreateUserDto {
  @IsNotEmpty()
  @MaxLength(50)
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
  birthday: Date;

  @IsNotEmpty()
  @IsEnum(GenderType)
  readonly gender: GenderType;

  @IsNotEmpty()
  @IsPhoneNumber("VN")
  readonly phone: string;

  @IsOptional()
  @MaxLength(20)
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly note: string;
}
