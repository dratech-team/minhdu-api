import {DatetimeUnit, Salary, SalaryType} from "@prisma/client";
import * as moment from "moment";
import {firstDatetimeOfMonth, lastDatetimeOfMonth} from "../../../../utils/datetime.util";
import {includesDatetime} from "../../../../common/utils/isEqual-datetime.util";
import {ALL_DAY, PARTIAL_DAY} from "../../../../common/constant/datetime.constant";

export function rageDaysInMonth(datetime: Date): moment.Moment[] {
  const range = [];
  const fromDate = moment(firstDatetimeOfMonth(datetime));
  const toDate = moment(lastDatetimeOfMonth(datetime));
  const diff = toDate.diff(fromDate, "days") + 1;
  for (let i = 0; i < diff; i++) {
    range.push(moment(firstDatetimeOfMonth(datetime)).add(i, "days"));
  }
  return range;
};

export const timesheet = (createdAt: Date, salaries: Salary[], isExport?: boolean) => {
  const diff = rageDaysInMonth(createdAt);
  const range = [];
  let total = 0;


  const allDay = salaries.filter(salary => (salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF) && salary.times === ALL_DAY && salary.unit === DatetimeUnit.DAY).map(salary => salary.datetime);
  const partialDay = salaries.filter(salary => (salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF) && salary.times === PARTIAL_DAY && salary.unit === DatetimeUnit.DAY).map(salary => salary.datetime);

  for (let i = 0; i < diff.length; i++) {
    const datetime = diff[i];
    let tick: string;
    let color = "#E02401";
    if (includesDatetime(partialDay, datetime.toDate())) {
      tick = "1/2";
      total += 1 / 2;
    } else if (includesDatetime(allDay, datetime.toDate())) {
      tick = "o";
    } else if (moment(new Date()).isBefore(datetime)) {
      tick = "-";
      color = "#717171";
    } else {
      tick = "x";
      color = "#09009B";
      total += 1;
    }

    const obj = {[datetime.format("DD-MM")]: tick, color: color};
    if (isExport) {
      range.push(tick);
    } else {
      range.push(obj);
    }
  }

  return {datetime: range, total};
};

