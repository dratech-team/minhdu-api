import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";
import {PartialDay} from "@prisma/client";

export class CreateDayoffDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => {
    return new Date(moment(value).set({hours: 0, minutes: 0, seconds: 0}).format('YYYY-MM-DD'));
  })
  readonly startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => {
    return new Date(moment(value).set({hours: 0, minutes: 0, seconds: 0}).format('YYYY-MM-DD'));
  })
  readonly endedAt: Date;

  @IsNotEmpty()
  @IsEnum(PartialDay)
  readonly partial: PartialDay;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;

  @IsOptional()
  @IsString()
  readonly note: string;
}
