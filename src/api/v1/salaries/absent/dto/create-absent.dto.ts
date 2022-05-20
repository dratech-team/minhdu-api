import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PartialDay} from "@prisma/client";
import * as moment from "moment";

export class CreateAbsentDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(PartialDay)
  readonly partial: PartialDay;

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

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({value}) => {
    if (value) {
      return new Date(value);
    }
  })
  readonly startTime: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({value}) => {
    if (value) {
      return new Date(value);
    }
  })
  readonly endTime: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly settingId: number;
  /// FIXME: block id chưa hoàn thành nên sẽ để optional. Sau khi hoàn thành thì sẽ là IsNotEmpty
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly blockId: number;

  @IsOptional()
  @IsString()
  readonly note: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;
}
