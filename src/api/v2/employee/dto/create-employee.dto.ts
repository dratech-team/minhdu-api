import {Type} from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxDate,
  ValidateNested
} from "class-validator";
import {CreateProfileDto} from "../../../../common/dtos/create-profile.dto";
import {CreateSocialDto} from "./create-social.dto";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";

export class CreateEmployeeDto extends CreateProfileDto {
  @IsOptional()
  code: string;

  @IsNotEmpty()
  @Type(() => Date)
  @MaxDate(new Date(), {message: `createdAt ${ValidatorMessage.datetime}`})
  @IsDate()
  readonly createdAt: Date

  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: `workedAt ${ValidatorMessage.datetime}`})
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

  @IsOptional()
  @ValidateNested()
  readonly social: CreateSocialDto;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly note: string;
}

