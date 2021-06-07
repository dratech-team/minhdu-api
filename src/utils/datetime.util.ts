import * as moment from "moment";

export function firstMonth(datetime: Date): Date {
  return moment(datetime).clone().startOf('month').toDate();
}

export function lastMonth(datetime: Date): Date {
  return moment(datetime).clone().endOf('month').toDate();
}
