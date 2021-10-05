import * as moment from "moment";
import {DATETIME_FORMAT, MONTH_FORMAT, YEAR_FORMAT} from "../constant/datetime.constant";

export function isEqualDatetime(datetime1: Date, datetime2: Date, type?: "MONTH" | "YEAR"): boolean {
  let format: string;
  switch (type) {
    case "MONTH": {
      format = MONTH_FORMAT;
      break;
    }
    case "YEAR": {
      format = YEAR_FORMAT;
      break;
    }
    default: {
      format = DATETIME_FORMAT;
      break;
    }
  }
  return moment(datetime1).format(type) === moment(datetime2).format(type);
}

export function includesDatetime(datetimes: Date[], datetime2: Date): boolean {
  return datetimes.map(datetime => moment(datetime).format(DATETIME_FORMAT)).includes(moment(datetime2).format(DATETIME_FORMAT));
}
