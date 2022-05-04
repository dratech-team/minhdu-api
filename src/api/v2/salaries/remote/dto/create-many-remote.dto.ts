import {IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {PartialDay, RemoteType} from "@prisma/client";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class CreateManyRemoteDto {
  @IsNotEmpty()
  @IsEnum(RemoteType)
  readonly type: RemoteType;

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

  @IsNotEmpty()
  @IsNumber({}, {each: true})
  @IsArray()
  @Type(() => Number)
  readonly payrollIds: number[];

  @IsOptional()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly blockId: number;

  @IsOptional()
  @IsString()
  readonly note: string;
}
