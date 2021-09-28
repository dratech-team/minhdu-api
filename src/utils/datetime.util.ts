import * as moment from "moment";

export function firstDatetimeOfMonth(datetime: string | Date | undefined): Date | undefined {
  return datetime ? moment(datetime).clone().startOf('month').toDate() : undefined;
}

export function lastDatetimeOfMonth(datetime: string | Date | undefined): Date | undefined {
  return datetime ? moment(datetime).clone().endOf('month').toDate() : undefined;
}

export function lastDayOfMonth(datetime: string | Date): number {
  const month = moment(datetime).format('MM/yyyy');
  const current = moment(new Date()).format('MM/yyyy');
  if (month === current) {
    return new Date().getDate();
  }

  return moment(datetime).endOf('month').date();
}

export function tomorrowDate() {
  return moment(new Date).add(1, 'day').toDate();
}
