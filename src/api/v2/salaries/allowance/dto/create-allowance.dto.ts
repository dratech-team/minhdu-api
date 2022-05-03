import {IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class CreateAllowanceDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

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
  @IsBoolean()
  @Type(() => Boolean)
  readonly inWorkday: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  readonly inOffice: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly rate: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly branchId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;
}
