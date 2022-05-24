import {DatetimeUnit, PartialDay} from "@prisma/client";
import * as moment from "moment";
import {includesDatetime} from "../../../../common/utils/isEqual-datetime.util";
import * as dateFns from "date-fns";
import {PayrollEntity} from "../entities";
import {SalaryFunctions} from "./salary.functions";

export const timesheet = (payroll: PayrollEntity, isExport?: boolean) => {
  const diff = dateFns.eachDayOfInterval({
    start: dateFns.startOfMonth(payroll.createdAt),
    end: dateFns.endOfMonth(payroll.createdAt),
  });
  const range = [];
  let total = 0;

  const dayoffs = SalaryFunctions.absentUniq(payroll.absents);
  const absents = SalaryFunctions.absentUniq(payroll.absents);

  const allDay = absents?.reduce((result, b) => {
    if (b.setting.unit === DatetimeUnit.DAY && b.partial === PartialDay.ALL_DAY) {
      result.push(b.datetime);
    }
    return result;
  }, []);
  const partialDay = absents?.reduce((result, b) => {
    if (b.setting.unit === DatetimeUnit.DAY && b.partial !== PartialDay.ALL_DAY) {
      result.push(b.datetime);
    }
    return result;
  }, []);

  for (let i = 0; i < diff.length; i++) {
    const datetime = diff[i];
    let tick: string;
    let color = "#E02401";

    if (moment(datetime).isBefore(payroll.createdAt, "days") || moment(datetime).isAfter(payroll?.accConfirmedAt, "days")) {
      tick = "N/A";
      color = "#717171";
    } else {
      if (partialDay && includesDatetime(partialDay, datetime)) {
        tick = "1/2";
        total += 1 / 2;
      } else if (allDay && includesDatetime(allDay, datetime)) {
        tick = "o";
      } else if (!payroll?.accConfirmedAt && moment(new Date()).isBefore(datetime)) {
        tick = "-";
        color = "#717171";
      } else {
        tick = "x";
        color = "#09009B";
        total += 1;
      }
    }

    const obj = {[dateFns.format(datetime, "DD-MM")]: tick, color: color};
    if (isExport) {
      range.push(tick);
    } else {
      range.push(obj);
    }
  }

  return {datetime: range, total};
};
