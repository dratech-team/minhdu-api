import * as moment from "moment";

export function firstDatetimeOfMonth(datetime: string | Date | undefined): Date | undefined {
  return datetime ? moment(datetime).clone().startOf('months').toDate() : undefined;
}

export function lastDatetimeOfMonth(datetime: string | Date | undefined): Date | undefined {
  return datetime ? moment(datetime).clone().endOf('months').toDate() : undefined;
}

// Ngày cuối cùng của tháng. Nếu tháng hiện tại thì ngày cuối cùng của tháng là hôm nay
export function lastDayOfMonth(datetime: Date): number {
  return moment(datetime).endOf('month').date();
}

export function tomorrowDate() {
  return moment(new Date).add(1, 'day').toDate();
}

export const generateDatetime = (start: any, end: any) => {
  const day1 = moment(new Date(end));
  const day2 = moment(new Date(start));
  const result = [moment({...day2})];

  while (day1.date() != day2.date()) {
    day2.add(1, 'day');
    result.push(moment({...day2}));
  }

  return result.map(x => x.toDate());

}
