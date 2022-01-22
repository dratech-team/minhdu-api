import {DegreeLevel, DegreeStatus, DegreeType, FormalityType} from "@prisma/client";
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate} from "class-validator";
import {Transform, Type} from "class-transformer";
import {tomorrowDate} from "../../../../utils/datetime.util";
import * as moment from "moment";

export class CreateDegreeDto {
  @IsNotEmpty()
  @IsString()
  readonly school: string;

  @IsNotEmpty()
  @IsEnum(DegreeType)
  readonly type: DegreeType;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly startedAt: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly endedAt: Date;

  @IsNotEmpty()
  @IsString()
  readonly major: string;

  @IsNotEmpty()
  @IsEnum(FormalityType)
  readonly formality: FormalityType;

  @IsOptional()
  @IsEnum(DegreeLevel)
  readonly level: DegreeLevel;

  @IsOptional()
  @IsEnum(DegreeStatus)
  readonly status: DegreeStatus;

  @IsOptional()
  @IsString()
  readonly note: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly employeeId: number;
}
