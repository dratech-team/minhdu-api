import * as moment from "moment";
import {DatetimeFormat} from "../constant/datetime.constant";

export function isEqualDatetime(datetime1: Date, datetime2: Date): boolean {
  return moment(datetime1).format(DatetimeFormat) === moment(datetime2).format(DatetimeFormat);
}

export function includesDatetime(datetimes: Date[], datetime2: Date): boolean {
  return datetimes.map(datetime => moment(datetime).format(DatetimeFormat)).includes(moment(datetime2).format(DatetimeFormat));
}
