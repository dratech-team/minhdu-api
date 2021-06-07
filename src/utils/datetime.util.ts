import * as moment from "moment";

export function firstMonth(datetime: Date): Date {
  return moment(datetime).clone().startOf('month').toDate();
}

export function lastMonth(datetime: Date): Date {
  return moment(datetime).clone().endOf('month').toDate();
}

export function lastDayOfMonth(datetime: Date): number {
  const month = moment(datetime).format('MM/yyyy');
  const current = moment(new Date()).format('MM/yyyy');
  if (month === current) {
    return new Date().getDate();
  }

  return moment(datetime).endOf('month').date();
}
