import {IsDate, IsOptional} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class SearchRangeDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly startedAt_start: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly startedAt_end: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly endedAt_start: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly endedAt_end: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly deliveredAt_start: Date;


  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly deliveredAt_end: Date;
}
