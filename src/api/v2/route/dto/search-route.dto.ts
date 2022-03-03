import {IsBoolean, IsDate, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class SearchRouteDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly startedAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly endedAt: Date;

  @IsOptional()
  @IsString()
  readonly driver: string;

  @IsOptional()
  @IsString()
  readonly bsx: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly status: 0 | 1

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly isRoute: boolean
}
