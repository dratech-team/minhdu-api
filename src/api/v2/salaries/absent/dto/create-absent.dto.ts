import {DatetimeUnit, PartialDay} from "@prisma/client";
import {IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class CreateAbsentDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(DatetimeUnit)
  readonly unit: DatetimeUnit;

  @IsNotEmpty()
  @IsEnum(PartialDay)
  readonly partial: PartialDay;

  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly endedAt: Date;

  @IsOptional()
  @IsDate()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly startTime: Date;

  @IsOptional()
  @IsDate()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly endTime: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly settingId: number;

  @IsOptional()
  @IsNumber({}, {each: true})
  @IsArray()
  readonly payrollIds: number[];

  /// FIXME: block id chưa hoàn thành nên sẽ để optional. Sau khi hoàn thành thì sẽ là IsNotEmpty
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly blockId: number;


  @IsOptional()
  @IsString()
  readonly note: string;
}
