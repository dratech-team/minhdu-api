import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";
import {PartialDay} from "@prisma/client";
import {CreateOvertimeAllowanceDto} from "./allowance/create-allowance.dto";

export class CreateOvertimeDto {
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
  @Transform(({value}) => {
    if (value) {
      return new Date(moment(value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly startTime: Date | null;

  @IsOptional()
  @IsDate()
  @Transform(({value}) => {
    if (value) {
      return new Date(moment(value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly endTime: Date | null;

  @IsNotEmpty()
  @IsEnum(PartialDay)
  readonly partial: PartialDay;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly settingId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly blockId: number;

  @IsOptional()
  @IsObject({each: true})
  readonly allowances: CreateOvertimeAllowanceDto;

  @IsOptional()
  @IsString()
  readonly note: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;
}
