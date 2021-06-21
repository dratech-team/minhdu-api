import {DegreeLevel, DegreeStatus, DegreeType, FormalityType} from "@prisma/client";
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate} from "class-validator";
import {Type} from "class-transformer";

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
  @MaxDate(new Date())
  readonly startedAt: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date())
  readonly endedAt: Date;

  @IsNotEmpty()
  @IsString()
  readonly major: string;

  @IsNotEmpty()
  @IsEnum(FormalityType)
  readonly formality: FormalityType;

  @IsOptional()
  @IsEnum(FormalityType)
  readonly level: DegreeLevel;

  @IsOptional()
  @IsEnum(DegreeStatus)
  readonly status: DegreeStatus;

  @IsNotEmpty()
  @IsString()
  readonly note: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly employeeId: number;


}
