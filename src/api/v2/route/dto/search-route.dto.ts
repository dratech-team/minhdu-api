import {IsDate, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import {SortRouteEnum} from "../enums/sort-route.enum";
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
  readonly search: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).utc().format('YYYY-MM-DD')))
  readonly startedAt_start: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).utc().format('YYYY-MM-DD')))
  readonly startedAt_end: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).utc().format('YYYY-MM-DD')))
  readonly endedAt_start: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).utc().format('YYYY-MM-DD')))
  readonly endedAt_end: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly status: 0 | 1 | -1


  @IsOptional()
  @IsEnum(SortRouteEnum)
  readonly sort: SortRouteEnum;

  @IsOptional()
  @IsString()
  readonly sortType: "asc" | "desc";
}
