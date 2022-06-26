import {AbsentEntity} from "../../../v1/payroll/entities/absent.entity";
import {AllowanceType, PayrollEntity} from "../entities";
import * as dateFns from "date-fns";
import {
  AllowanceSalary,
  ConditionType,
  DatetimeUnit,
  DayOffSalary,
  PartialDay,
  RateConditionType,
  SalarySetting
} from "@prisma/client";
import {OvertimeEntity} from "../../../v1/salaries/overtime/entities";
import {HolidayEntity} from "../../salaries/holiday/entities/holiday.entity";
import {HandleOvertimeEntity} from "../entities/handle-overtime.entity";
import {RemoteEntity} from "../../../v1/salaries/remote/entities/remote.entity";
import {DayoffEnity} from "../../../v1/salaries/dayoff/entities/dayoff.entity";
import {DatetimeUniq} from "./datetime-uniq.functions";
import {SalarySettingsEntity} from "../../../v1/settings/salary/entities/salary-settings.entity";

export namespace SalaryUtils {
  export const totalSetting = (setting: SalarySetting, payroll: PayrollEntity): number => {
    const totalOf = (setting.prices?.reduce((a, b) => a + b, 0) || setting.totalOf?.map(type => {
      return payroll.salariesv2?.filter(salary => salary.type === type).reduce((a, b) => a + b.price * b.rate, 0);
    }).reduce((a, b) => a + b, 0));
    return totalOf / (setting.totalOf.length ? (setting.workday || payroll.workday || payroll.employee.workday) : 1);
  };

  export const uniqSalary = (items: Array<AbsentEntity | DayoffEnity | AllowanceSalary | RemoteEntity>): Array<(AbsentEntity | DayoffEnity | AllowanceSalary | RemoteEntity) & { datetime: Date }> => {
    return DatetimeUniq.datimeUniq(items.map(item => ({start: item.startedAt, end: item.endedAt, id: item.id})))
      .map(uniq => Object.assign({}, items.find(item => item.id === uniq.id), {datetime: uniq.datetime}));
  };

  export const getWorkday = (payroll: PayrollEntity) => {
    const absent = payroll.absents
      ?.reduce((a, b) => a + handleAbsent(b, payroll).duration * (b.partial === PartialDay.ALL_DAY ? 1 : 0.5), 0);
    const dayoff = payroll.dayoffs
      ?.reduce((a, b) => a + handleDayOff(b, payroll).duration * (b.partial === PartialDay.ALL_DAY ? 1 : 0.5), 0);
    return (dateFns.isSameMonth(new Date(), payroll.createdAt) ? new Date().getDate() + 1 : dateFns.getDaysInMonth(payroll.createdAt)) - (absent + dayoff + (payroll.createdAt.getDate() - 1));
  };

  export const handleAbsent = (absent: AbsentEntity, payroll: PayrollEntity): { duration: number, price: number } => {
    const settingTotal = totalSetting(absent.setting, payroll);

    const datetimes = dateFns.eachDayOfInterval({
      start: absent.startedAt,
      end: absent.endedAt
    });
    const duration = datetimes.length;
    return {
      duration: duration,
      price: settingTotal
    };
  };

  export const handleDayOff = (dayoff: DayoffEnity, payroll: PayrollEntity): { duration: number } => {
    const datetimes = dateFns.eachDayOfInterval({
      start: dayoff.startedAt,
      end: dayoff.endedAt
    });
    const duration = datetimes.length;
    return {
      duration: duration
    };
  };

  export const handleAllowance = (allowance: AllowanceSalary, payroll: PayrollEntity): { duration: number, total: number } => {
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
    const duration = allowances.reduce((a, b) => a + b.duration, 0);
    return {
      duration: duration,
      total: (allowance.unit === DatetimeUnit.MONTH ? (allowance.price / days) : allowance.price) * allowance.rate * duration,
    };
  };


  /*
  * Overtime
  * unit: DAY, HOUR
  * */
  export const handleOvertime = (overtime: OvertimeEntity, payroll: PayrollEntity): Array<HandleOvertimeEntity> => {
    const overtimeRateCondition = payroll.overtimes.filter(overtime => overtime.setting.rateConditionId && overtime.setting.unit === DatetimeUnit.DAY)
      .reduce((a, b) => a + (b.partial !== PartialDay.ALL_DAY && b.partial !== PartialDay.NIGHT ? 0.5 : 1), 0);
    let duration: number = getRateDuration(overtime.setting, payroll);
    const absentRange = absentUniq(payroll.absents);

    const datetimes = dateFns.eachDayOfInterval({
      start: overtime.startedAt,
      end: overtime.endedAt,
    });

    return datetimes.map(datetime => Object.assign({}, overtime, {datetime}))
      .sort(alphabetically(true))
      .map(e => {
        const absent = absentRange.find(absent => absent.datetime.getTime() === e.datetime.getTime());
        let partial: number;

        if (overtime.setting.unit === DatetimeUnit.HOUR) {
          partial = dateFns.differenceInMinutes(overtime.endTime, overtime.startTime) / 60;
        } else {
          // Không tồn tại ngày vắng trong ngày tăng ca này.
          if (!absent) {
            partial = 1;
          } else {
            if (
              e.partial === PartialDay.NIGHT &&
              (absent.partial === PartialDay.ALL_DAY || absent.partial === PartialDay.MORNING || absent.partial === PartialDay.AFTERNOON)
            ) {
              partial = 1;
            } else if (
              (e.partial === PartialDay.ALL_DAY && absent.partial === PartialDay.ALL_DAY) ||
              (e.partial === PartialDay.MORNING && absent.partial === PartialDay.MORNING) ||
              (e.partial === PartialDay.AFTERNOON && absent.partial === PartialDay.AFTERNOON)
            ) {
              partial = 0;
            } else {
              partial = 0.5;
            }
          }
        }
        const setting = Object.assign({}, e.setting, {
          rate: e.setting.rate > 1 && e.setting.rateCondition
            ? duration > 0 ? e.setting.rate : e.setting.rateCondition.default
            : e.setting.rate
        });

        duration -= 1;
        const settingTotal = totalSetting(setting, payroll);
        const allowanceTotal = overtime.allowances?.reduce((a, b) => a + b.price, 0);
        const overtimeTotal = settingTotal * partial * (setting.unit === DatetimeUnit.DAY && overtime.partial !== PartialDay.ALL_DAY && overtime.partial !== PartialDay.NIGHT ? 0.5 : 1) * setting.rate;
        return Object.assign(e, {
          price: settingTotal,
          rate: setting.rate,
          datetime: e.datetime,
          duration: partial,
          setting: setting,
          allowanceTotal: allowanceTotal,
          total: overtimeTotal + allowanceTotal
        });
      });
  };

  export const handleHoliday = (holiday: HolidayEntity, payroll: PayrollEntity) => {
    const holidayRateCondition = payroll.holidays.filter(overtime => overtime.setting.rateCondition && overtime.setting.unit === DatetimeUnit.DAY);

    let duration: number = getRateDuration(holiday.setting, payroll) - holidayRateCondition.length;
    const absentRange = absentUniq(payroll.absents);

    const datetimes = dateFns.eachDayOfInterval({
      start: holiday.setting.startedAt,
      end: holiday.setting.endedAt,
    });

    return datetimes.map(datetime => Object.assign({}, holiday, {datetime}))
      .sort(alphabetically(true))
      .map(e => {
        const absent = absentRange.find(e => e.datetime.getTime() === e.datetime.getTime());
        const d = !absentRange.map(e => e.datetime.getTime()).includes(e.datetime.getTime())
          ? 1
          : absent.partial !== PartialDay.ALL_DAY
            ? 0.5
            : 0;
        duration -= 1;

        const settingTotal = totalSetting(holiday.setting, payroll);
        return Object.assign(e, {
          duration: d,
          setting: Object.assign({}, e.setting, {
            rate: e.setting.rateCondition
              ? e.setting.rateCondition.condition === ConditionType.NO_CONDITION
                ? e.setting.rate
                : duration > 0 ? e.setting.rate : e.setting.rateCondition.default
              : 1
          }),
          settingTotal: settingTotal,
          price: settingTotal,
          rate: e.setting.rate,
          datetime: e.datetime,
          total: settingTotal * d * e.setting.rate
        });
      });
  };

  export const remoteUniq = (remotes: RemoteEntity[]) => {
    return uniqSalary(remotes) as Array<RemoteEntity & { datetime: Date }>;
  };

  export const absentUniq = (absents: AbsentEntity[]) => {
    return uniqSalary(absents) as Array<AbsentEntity & { datetime: Date }>;
  };

  export const dayoffUniq = (dayoffs: DayOffSalary[]) => {
    return uniqSalary(dayoffs) as Array<DayOffSalary & { datetime: Date }>;
  };

  export const getRateDuration = (setting: SalarySettingsEntity, payroll: PayrollEntity): number => {
    const rateCondition = setting.rateCondition;

    const absentRange = absentUniq(payroll.absents);
    const totalAbsent = absentRange.reduce((a, b) => a + (b.partial === PartialDay.ALL_DAY ? 1 : 0.5), 0);

    if (rateCondition) {
      const withOf = rateCondition.with === 0 ? (payroll.workday || payroll.employee.workday) : rateCondition.with;
      if (rateCondition.type === RateConditionType.WORKDAY) {
        if (rateCondition.condition === ConditionType.GREATER || rateCondition.condition === ConditionType.GREATER_EQUAL) {
          return getWorkday(payroll) - withOf;
        } else {
          return withOf - getWorkday(payroll);
        }
      } else {
        if (rateCondition.condition === ConditionType.GREATER || rateCondition.condition === ConditionType.GREATER_EQUAL) {
          return totalAbsent - withOf;
        } else {
          return withOf - totalAbsent;
        }
      }
    }
    return -1;
  };
}


function alphabetically(ascending) {
  return function (a: OvertimeEntity | HolidayEntity, b: OvertimeEntity | HolidayEntity) {
    if (a.setting.rateCondition && a.setting.rate === b.setting.rate) {
      return 0;
    } else if (a.setting.rateCondition === null) {
      return 1;
    } else if (b.setting.rateCondition === null) {
      return -1;
    } else if (a.setting.rateCondition && ascending) {
      return a.setting.rate < b.setting.rate ? -1 : 1;
    } else {
      return a.setting.rate < b.setting.rate ? 1 : -1;
    }
  };
}

