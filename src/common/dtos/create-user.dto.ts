import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength
} from "class-validator";
import {Type} from "class-transformer";
import {GenderEnum} from "../../core/enum/gender.enum";

export class ICreateUserDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  readonly fullName: string;

  @IsNotEmpty()
  @MaxLength(200)
  @IsString()
  readonly address: string;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  readonly birthday: Date;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  readonly gender: GenderEnum;

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
