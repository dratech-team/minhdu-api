import {DatetimeUnit, PartialDay} from "@prisma/client";
import * as moment from "moment";
import {includesDatetime} from "../../../../common/utils/isEqual-datetime.util";
import {PayrollEntity} from "../entities";
import {SalaryFunctions} from "./salary.functions";
import {firstDatetime, lastDatetime} from "../../../../utils/datetime.util";
import {rageDateTime} from "../../../v1/payroll/functions/timesheet";

const timesheet = (payroll: PayrollEntity | any, isExport?: boolean) => {
  const diff = rageDateTime(firstDatetime(payroll.createdAt), lastDatetime(payroll.createdAt));
  const range = [];
  let total = 0;

  const dayoffs = SalaryFunctions.dayoffUniq(payroll.dayoffs).map(e => ({
    unit: DatetimeUnit.DAY,
    partial: e.partial,
    datetime: e.datetime
  }));
  const absents = SalaryFunctions.absentUniq(payroll.absents).map(e => ({
    unit: e.setting.unit,
    partial: e.partial,
    datetime: e.datetime
  })).concat(dayoffs);

  const allDay = absents?.reduce((result, b) => {
    if (b.unit === DatetimeUnit.DAY && b.partial === PartialDay.ALL_DAY) {
      result.push(b.datetime);
    }
    return result;
  }, []);
  const partialDay = absents?.reduce((result, b) => {
    if (b.unit === DatetimeUnit.DAY && b.partial !== PartialDay.ALL_DAY) {
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
      if (partialDay && includesDatetime(partialDay, datetime.toDate())) {
        tick = "1/2";
        total += 1 / 2;
      } else if (allDay && includesDatetime(allDay, datetime.toDate())) {
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

    const obj = {[datetime.format("DD-MM")]: tick, color: color};
    if (isExport) {
      range.push(tick);
    } else {
      range.push(obj);
    }
  }

  return {datetime: range, total};
};

export const TimeSheet = {timesheet};
