import {IsDate, IsOptional} from "class-validator";
import {Transform} from "class-transformer";
import * as moment from "moment";
import * as dateFns from "date-fns";

export class SearchRangeDto {
  @IsOptional()
  @IsDate()
  @Transform((val) => {
    if (dateFns.isDate(val?.value)) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly startedAt_start: Date;

  @IsOptional()
  @IsDate()
  @Transform((val) => {
    if (dateFns.isDate(val?.value)) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly startedAt_end: Date;

  @IsOptional()
  @IsDate()
  @Transform((val) => {
    if (dateFns.isDate(val?.value)) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly endedAt_start: Date;

  @IsOptional()
  @IsDate()
  @Transform((val) => {
    if (dateFns.isDate(val?.value)) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly endedAt_end: Date;

  @IsOptional()
  @IsDate()
  @Transform((val) => {
    if (dateFns.isDate(val?.value)) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly deliveredAt_start: Date;


  @IsOptional()
  @IsDate()
  @Transform((val) => {
    if (dateFns.isDate(val?.value)) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly deliveredAt_end: Date;
}
