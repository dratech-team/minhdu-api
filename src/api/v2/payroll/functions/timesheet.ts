import {Salary} from "@prisma/client";
import * as moment from "moment";
import {firstDatetimeOfMonth, lastDatetimeOfMonth} from "../../../../utils/datetime.util";
import {includesDatetime} from "../../../../common/utils/isEqual-datetime.util";
import {PARTIAL_DAY} from "../../../../common/constant/datetime.constant";

export const rageDaysInMonth = (datetime: Date) => {
  const range = [];
  const fromDate = moment(firstDatetimeOfMonth(datetime));
  const toDate = moment(lastDatetimeOfMonth(datetime));
  const diff = toDate.diff(fromDate, "days");
  for (let i = 0; i < diff; i++) {
    range.push(moment(firstDatetimeOfMonth(datetime)).add(i, "days"))
  }
  return range;
}

export const timesheet = (createdAt: Date, salaries: Salary[], isExport?: boolean) => {
  const diff = rageDaysInMonth(createdAt);
  const range = []

  for (let i = 0; i < diff.length; i++) {
    const datetime = diff[i];
    const tick = includesDatetime(salaries.filter(salary => salary.datetime && salary.times === PARTIAL_DAY).map(salary => salary.datetime), datetime.toDate())
      ? "1/2"
      : includesDatetime(salaries.map(salary => salary.datetime), datetime.toDate())
        ? "o"
        : "x";
    const obj = {[datetime.format("DD-MM")]: tick};
    if (isExport) {
      range.push(tick);
    } else {
      range.push(obj);
    }
  }
  return range;
}
