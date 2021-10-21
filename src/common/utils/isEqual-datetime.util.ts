import * as moment from "moment";
import {DATETIME_FORMAT} from "../constant/datetime.constant";

export function isEqualDatetime(datetime1: Date, datetime2: Date, type?: "month" | "year" | "day"): boolean {
  return moment(datetime1).isSame(datetime2, type || "day");
}

export function includesDatetime(datetimes: Date[], datetime2: Date): boolean {
  return datetimes.map(datetime => moment(datetime).format(DATETIME_FORMAT)).includes(moment(datetime2).format(DATETIME_FORMAT));
}
