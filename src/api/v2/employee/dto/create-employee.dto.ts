import { Type } from "class-transformer";
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
import { ValidatorMessage } from "../../../../common/constant/validator.constant";
import { CreateProfileDto } from "../../../../common/dtos/create-profile.dto";
import { tomorrowDate } from "../../../../utils/datetime.util";
import { CreateSocialDto } from "./create-social.dto";

export class CreateEmployeeDto extends CreateProfileDto {
  @IsOptional()
  code: string;

  @IsOptional()
  @Type(() => Date)
  @MaxDate(tomorrowDate(), {
    message: `createdAt ${ValidatorMessage.datetime}`,
  })
  @IsDate()
  readonly createdAt: Date;

  @Type(() => Date)
  @IsDate()
  @MaxDate(tomorrowDate(), { message: `workedAt ${ValidatorMessage.datetime}` })
  @IsOptional()
  readonly workedAt: Date;

  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  readonly isFlatSalary: boolean;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly branchId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly positionId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly workday: number;

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
