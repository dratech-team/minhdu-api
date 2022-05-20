import {IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PartialDay} from "@prisma/client";
import * as moment from "moment";

export class SearchOvertimeDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({}, {each: true})
  readonly skip: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({}, {each: true})
  readonly take: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;

  @IsOptional()
  @IsArray()
  @Transform(val => {
    return typeof val.value === 'string' ? Array.of(val.value) : val.value;
  })
  readonly titles: string[];

  @IsOptional()
  @IsEnum(PartialDay)
  readonly partial: PartialDay;

  @IsOptional()
  @IsDate()
  @Transform(({value}) => {
    return new Date(moment(value).set({hours: 0, minutes: 0, seconds: 0}).format('YYYY-MM-DD'));
  })
  readonly startedAt: Date;

  @IsOptional()
  @IsDate()
  @Transform(({value}) => {
    return new Date(moment(value).set({hours: 0, minutes: 0, seconds: 0}).format('YYYY-MM-DD'));
  })
  readonly endedAt: Date;

  @IsOptional()
  @IsString()
  readonly groupBy?: "payrollId";
}
