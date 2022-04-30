import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
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
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly ended: Date;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Boolean)
  readonly isWorkday: boolean;

  @IsNotEmpty()
  @IsNumber()
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
