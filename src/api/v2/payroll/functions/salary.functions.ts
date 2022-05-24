import {AbsentEntity} from "../../../v1/payroll/entities/absent.entity";
import {AllowanceType, PayrollEntity} from "../entities";
import * as dateFns from "date-fns";
import {AllowanceSalary, DatetimeUnit, DayOffSalary, PartialDay, SalarySetting, SalaryType} from "@prisma/client";
import {OvertimeEntity} from "../../../v1/salaries/overtime/entities";
import {HolidayEntity} from "../../salaries/holiday/entities/holiday.entity";
import {HandleOvertimeEntity} from "../entities/handle-overtime.entity";
import {RemoteEntity} from "../../../v1/salaries/remote/entities/remote.entity";
import {DayoffEnity} from "../../../v1/salaries/dayoff/entities/dayoff.entity";
import {DatetimeUniq} from "./datetime-uniq.functions";

const totalSetting = (setting: SalarySetting, payroll: PayrollEntity): number => {
  const totalOf = (setting.prices?.reduce((a, b) => a + b, 0) || setting.totalOf?.map(type => {
    return payroll.salariesv2?.filter(salary => salary.type === type).map((e) => e.price * e.rate).reduce((a, b) => a + b, 0);
  }).reduce((a, b) => a + b, 0));
  return totalOf / (setting.type !== SalaryType.OVERTIME ? (setting.workday || payroll.workday || payroll.employee.workday) : 1);
};

const uniqSalary = (items: Array<AbsentEntity | DayoffEnity | AllowanceSalary | RemoteEntity>): Array<(AbsentEntity | DayoffEnity | AllowanceSalary | RemoteEntity) & { datetime: Date }> => {
  return DatetimeUniq.datimeUniq(items.map(item => ({start: item.startedAt, end: item.endedAt, id: item.id})))
    .map(uniq => Object.assign({}, items.find(item => item.id === uniq.id), {datetime: uniq.datetime}));
};

const getWorkday = (payroll) => {
  const absentDuration = payroll.absents.map(absent => {
    return handleAbsent(absent, payroll).duration * (absent.partial === PartialDay.ALL_DAY ? 1 : 0.5);
  })?.reduce((a, b) => a + b, 0);
  return (dateFns.isSameMonth(new Date(), payroll.createdAt) ? new Date().getDate() + 1 : dateFns.getDaysInMonth(payroll.createdAt)) - (absentDuration + (payroll.createdAt.getDate() - 1));
};

const handleAbsent = (absent: AbsentEntity, payroll: PayrollEntity): { duration: number, price: number } => {
  const settingTotal = totalSetting(absent.setting, payroll);

  const datetimes = dateFns.eachDayOfInterval({
    start: absent.startedAt,
    end: absent.endedAt
  });
  return {
    duration: datetimes.length,
    price: settingTotal * datetimes.length
  };
};

const handleAllowance = (allowance: AllowanceSalary, payroll: PayrollEntity): { duration: number, total: number } => {
  const allowances: Array<AllowanceType> = [];

  const absentRange = absentUniq(payroll.absents);
  const remoteRange = remoteUniq(payroll.remotes);

  const datetimes = dateFns.eachDayOfInterval({
    start: allowance.startedAt,
    end: allowance.endedAt
  });

  const days = dateFns.getDaysInMonth(allowance.startedAt);

  datetimes.forEach(datetime => {
    const exist = allowances.map(allowance => allowance.datetime.getTime()).includes(datetime.getTime());
    const absent = absentRange.find(absent => absent.datetime.getTime() === datetime.getTime());
    const remote = remoteRange.find(remote => remote.datetime.getTime() === datetime.getTime());

    if (!exist) {
      const absentsTime = absentRange.map(absent => absent.datetime.getTime());
      const remotesTime = remoteRange.map(remote => remote.datetime.getTime());

      if (allowance.inWorkday && !allowance.inOffice || !allowance.inWorkday && allowance.inOffice) {
        if (!(allowance.inWorkday && !allowance.inOffice ? absentsTime : remotesTime).includes(datetime.getTime())) {
          allowances.push(Object.assign({}, allowance, {datetime, duration: 1}));
        } else {
          if (
            allowance.inWorkday && !allowance.inOffice ? absent : remote
              && ((allowance.inWorkday && !allowance.inOffice ? absent : remote).partial === PartialDay.MORNING || (allowance.inWorkday && !allowance.inOffice ? absent : remote).partial === PartialDay.AFTERNOON)
          ) {
            allowances.push(Object.assign({}, allowance, {datetime, duration: 0.5}));
          }
        }
      } else if (allowance.inWorkday && allowance.inOffice) {
        if (!absentsTime.includes(datetime.getTime()) && remotesTime.includes(datetime.getTime())) {
          allowances.push(Object.assign({}, allowance, {
            datetime: datetime,
            duration: remote.partial === PartialDay.MORNING || remote.partial === PartialDay.AFTERNOON ? 0.5 : 1
          }));
        } else if (absentsTime.includes(datetime.getTime()) && !remotesTime.includes(datetime.getTime())) {
          if (absent.partial === PartialDay.MORNING || absent.partial === PartialDay.AFTERNOON) {
            allowances.push(Object.assign({}, allowance, {
              datetime: datetime,
              duration: 0.5
            }));
          }
        } else if (!absentsTime.includes(datetime.getTime()) && !remotesTime.includes(datetime.getTime())) {
          allowances.push(Object.assign({}, allowance, {datetime: datetime, duration: 1}));
        } else {
          if (absent && !remote || !absent && remote) {
            if ((absent && !remote ? absent : remote).partial === PartialDay.MORNING || (absent && !remote ? absent : remote).partial === PartialDay.AFTERNOON) {
              allowances.push(Object.assign({}, allowance, {
                datetime: datetime,
                duration: 0.5
              }));
            }
          } else {
            if (
              remote.partial === PartialDay.MORNING && absent.partial === PartialDay.MORNING
              || remote.partial === PartialDay.AFTERNOON && absent.partial === PartialDay.AFTERNOON
            ) {
              allowances.push(Object.assign({}, allowance, {datetime, duration: 0.5}));
            }
          }
        }
      } else {
        allowances.push(Object.assign({}, allowance, {datetime: datetime, duration: 1}));
      }
    }
  });
  const duration = allowances.map(allowance => allowance.duration).reduce((a, b) => a + b, 0);
  return {
    duration: duration,
    total: (allowance.unit === DatetimeUnit.MONTH ? (allowance.price / days) : allowance.price) * allowance.rate * duration,
  };
};

const handleOvertimeOrHoliday = (salary: OvertimeEntity | HolidayEntity, payroll: PayrollEntity): Array<HandleOvertimeEntity> => {
  const absentRange = absentUniq(payroll.absents);
  let duration = getWorkday(payroll) - (payroll.workday || payroll.employee.workday);
  const datetimes = dateFns.eachDayOfInterval({
    start: salary?.setting.type === "OVERTIME" ? (salary as OvertimeEntity).startedAt : (salary as HolidayEntity).setting.startedAt,
    end: salary?.setting.type === "OVERTIME" ? (salary as OvertimeEntity).endedAt : (salary as HolidayEntity).setting.endedAt,
  });

  const newOvertimes = datetimes.map(datetime => Object.assign({}, salary, {datetime}))
    .map(e => {
      if (!absentRange.map(e => e.datetime.getTime()).includes(e.datetime.getTime())) {
        return Object.assign(e, {duration: 1});
      }
      const absent = absentRange.find(e => e.datetime.getTime() === e.datetime.getTime());
      return Object.assign(e, {duration: absent.partial !== PartialDay.ALL_DAY ? 0.5 : 0});
    })
    .map((e, i) => {
      const setting = Object.assign({}, e.setting, {rate: duration > 0 ? e.setting.rate : 1});
      duration -= 1;
      return Object.assign(e, {setting});
    })
    .map(overtime => {
      const settingTotal = totalSetting(overtime.setting, payroll);
      return Object.assign(overtime, {totalSetting: settingTotal});
    });
  return newOvertimes.map((salary) => Object.assign({}, salary, {
    price: salary.totalSetting,
    rate: salary.setting.rate,
    datetime: salary.datetime,
    total: salary.totalSetting * salary.duration * salary.setting.rate
  }));
};

const remoteUniq = (remotes: RemoteEntity[]) => {
  return uniqSalary(remotes) as Array<RemoteEntity & { datetime: Date }>;
};

const absentUniq = (absents: AbsentEntity[]) => {
  return uniqSalary(absents) as Array<AbsentEntity & { datetime: Date }>;
};

const dayoffUniq = (dayoffs: DayOffSalary[]) => {
  return uniqSalary(dayoffs) as Array<DayOffSalary & { datetime: Date }>;
};

export const SalaryFunctions = {
  totalSetting,
  handleOvertimeOrHoliday,
  handleAllowance,
  getWorkday,
  handleAbsent,
  uniqSalary,
  absentUniq,
  dayoffUniq,
  remoteUniq
};

