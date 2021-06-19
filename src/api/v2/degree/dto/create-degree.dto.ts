import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate, MinDate} from "class-validator";
import {Type} from "class-transformer";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";
import {DegreeLevel, DegreeStatus, FormalityType} from "@prisma/client";

export class CreateDegreeDto {
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  readonly startedAt: Date;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  @MinDate(new Date(), {message: ValidatorMessage.datetime})
  readonly endedAt: Date;

  @IsNotEmpty()
  @IsString()
  readonly major: string;

  @IsNotEmpty()
  @IsEnum(FormalityType)
  readonly formality: FormalityType;

  @IsNotEmpty()
  @IsEnum(DegreeLevel)
  readonly level: DegreeLevel;

  @IsNotEmpty()
  @IsEnum(DegreeStatus)
  readonly status: DegreeStatus;

  @IsOptional()
  @IsString()
  readonly note: string

  @IsNotEmpty()
  @IsNumber()
  readonly employeeId: number;
}
