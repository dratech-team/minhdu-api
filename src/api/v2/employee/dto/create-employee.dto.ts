import {Type} from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from "class-validator";
import {CreateProfileDto} from "./create-profile.dto";
import {CreateSocialDto} from "./create-social.dto";

export class CreateEmployeeDto {
  @IsOptional()
  code: string;

  /// FIXME: Max date đang bị lỗi
  @Type(() => Date)
  @IsNotEmpty()
  // @MaxDate(new Date(), {message: `createdAt ${ValidatorMessage.datetime}`})
  @IsDate()
  readonly createdAt: Date

  /// FIXME: Max date đang bị lỗi
  @Type(() => Date)
  @IsDate()
  // @MaxDate(new Date(), {message: `workedAt ${ValidatorMessage.datetime}`})
  @IsNotEmpty()
  readonly workedAt: Date;

  @IsOptional()
  @IsString()
  qrCode: string;

  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  readonly isFlatSalary: boolean

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly positionId: number;

  @IsNotEmpty()
  @ValidateNested()
  readonly profile: CreateProfileDto;

  @IsOptional()
  @ValidateNested()
  readonly social: CreateSocialDto;

  @IsOptional()
  @MaxLength(20)
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly note: string;
}

