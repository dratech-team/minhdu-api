import {IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";
import {DatetimeUnit} from "@prisma/client";

export class CreateAllowanceDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(DatetimeUnit)
  readonly unit: DatetimeUnit;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  readonly inWorkday: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  readonly inOffice: boolean;

  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => {
    return new Date(moment(value).set({hours: 0, minutes: 0, seconds: 0}).format('YYYY-MM-DD'));
  })
  readonly startedAt?: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => {
    return new Date(moment(value).set({hours: 0, minutes: 0, seconds: 0}).format('YYYY-MM-DD'));
  })
  readonly endedAt?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly rate?: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly blockId?: number;

  @IsOptional()
  @IsString()
  readonly note: string;
}
