import {DatetimeUnit, Payroll, Salary, SalaryType} from "@prisma/client";
import * as moment from "moment";
import {compareDatetime, firstDatetime, lastDatetime} from "../../../../utils/datetime.util";
import {includesDatetime} from "../../../../common/utils/isEqual-datetime.util";
import {ALL_DAY, PARTIAL_DAY} from "../../../../common/constant/datetime.constant";
import {OnePayroll} from "../entities/payroll.entity";

export function rageDateTime(startedAt: Date, endedAt: Date, type: "days" | "months" | "years" = "days"): moment.Moment[] {
  const range = [];
  const fromDate = moment(startedAt);
  const toDate = moment(endedAt);
  const diff = toDate.diff(fromDate, type || "days") + 1;
  for (let i = 0; i < diff; i++) {
    range.push(moment(startedAt).add(i, type || "days"));
  }
  return range;
};

export const timesheet = (payroll: any, isExport?: boolean) => {
  const createdAt = compareDatetime(payroll.employee.createdAt, payroll.createdAt, "months") ? payroll.employee.createdAt : payroll.createdAt;
  const diff = rageDateTime(firstDatetime(payroll.createdAt), lastDatetime(payroll.createdAt));
  const range = [];
  let total = 0;

  const allDay = payroll.salaries.filter(salary => (salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF) && salary.times === ALL_DAY && salary.unit === DatetimeUnit.DAY).map(salary => salary.datetime);
  const partialDay = payroll.salaries.filter(salary => (salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF) && salary.times === PARTIAL_DAY && salary.unit === DatetimeUnit.DAY).map(salary => salary.datetime);

  for (let i = 0; i < diff.length; i++) {
    const datetime = diff[i];
    let tick: string;
    let color = "#E02401";

    if (moment(diff[i]).isBefore(createdAt, "days") || moment(diff[i]).isAfter(payroll?.accConfirmedAt, "days")) {
      tick = "N/A";
      color = "#717171";
    } else {
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

