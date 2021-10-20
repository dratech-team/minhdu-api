import {Salary, SalaryType} from "@prisma/client";
import * as moment from "moment";
import {firstDatetimeOfMonth, lastDatetimeOfMonth} from "../../../../utils/datetime.util";
import {includesDatetime, isEqualDatetime} from "../../../../common/utils/isEqual-datetime.util";
import {PARTIAL_DAY} from "../../../../common/constant/datetime.constant";

export const rageDaysInMonth = (datetime: Date) => {
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

  for (let i = 0; i < diff.length; i++) {
    const datetime = diff[i];
    let tick: string;
    let color = "#E02401";
    if (includesDatetime(salaries.filter(salary => (salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF) && salary.datetime && salary.times === PARTIAL_DAY).map(salary => salary.datetime), datetime.toDate())) {
      tick = "1/2";
      total += 1 / 2;
    } else if (includesDatetime(salaries.filter(salary => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF).map(salary => salary.datetime), datetime.toDate())) {
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

  /// FIXME: DEVELOP
  // return {datime: range, total};
  return range;

};

