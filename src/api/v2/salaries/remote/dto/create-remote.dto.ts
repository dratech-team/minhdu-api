import {RemoteType} from "@prisma/client";
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class CreateRemoteDto {
  @IsNotEmpty()
  @IsEnum(RemoteType)
  readonly type: RemoteType;

  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly startedAt: Date;


  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly endedAt: Date;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;

  @IsOptional()
  @IsString()
  readonly note: string;
}
