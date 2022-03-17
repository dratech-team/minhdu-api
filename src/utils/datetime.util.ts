import * as Moment from "moment";
import {extendMoment} from "moment-range";

const moment = extendMoment(Moment);

export function firstDatetime(datetime: string | Date | undefined, type?: "years" | "months" | "days"): Date | undefined {
  return datetime ? moment(datetime).clone().startOf(type || "months").toDate() : undefined;
}

export function lastDatetime(datetime: string | Date | undefined, type?: "years" | "months" | "days"): Date | undefined {
  return datetime ? moment(datetime).clone().endOf(type || "months").toDate() : undefined;
}

// Ngày cuối cùng của tháng. Nếu tháng hiện tại thì ngày cuối cùng của tháng là hôm nay
export function lastDayOfMonth(datetime: Date): number {
  return moment(datetime).endOf('month').date();
}

export function tomorrowDate(datetime?: Date) {
  return moment(datetime || new Date).add(1, 'day').toDate();
}

export function rangeDatetime(start: Date, end: Date, type?: 'days' | 'years') {
  return Array.from(moment().range(start, tomorrowDate(end)).by(type || 'day', {excludeEnd: true}));
}

export function beforeDatetime(i: number, type?: "days" | "months" | "years", datetime?: Date) {
  return moment(datetime || new Date()).subtract(i, type || "months").toDate();
}

export const compareDatetime = (date1: Date, date2: Date, unitOfType?: "days" | "months" | "years") => {
  return moment(date1).diff(date2, unitOfType || "days") === 0;
}
