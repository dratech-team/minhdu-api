import {IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";
import {SortRouteEnum, SortType} from "../enums/sort-route.enum";

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
  @IsEnum(SortRouteEnum)
  readonly sort: SortRouteEnum;

  @IsOptional()
  @IsEnum(SortType)
  readonly sortType: SortType;
}
