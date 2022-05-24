import {Injectable} from '@nestjs/common';
import {CreatePayrollDto} from './dto/create-payroll.dto';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {PayrollRepository} from "./payroll.repository";
import {EmployeeService} from "../../v1/employee/employee.service";
import {SalaryService} from "../salaries/salary/salary.service";
import {AllowanceService} from "../../v1/salaries/allowance/allowance.service";
import {AbsentService} from "../../v1/salaries/absent/absent.service";
import {OvertimeService} from "../../v1/salaries/overtime/overtime.service";
import {RemoteService} from "../../v1/salaries/remote/remote.service";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {CreateManyPayrollDto} from "../../v1/payroll/dto/create-many-payroll.dto";
import {firstDatetime, lastDatetime} from "../../../utils/datetime.util";
import {EmployeeStatusEnum} from "../../v1/employee/enums/employee-status.enum";
import {isEqualDatetime} from "../../../common/utils/isEqual-datetime.util";
import {crudManyResponse} from "../../v1/salaries/base/functions/response.function";
import {SearchPayrollDto} from "../../v1/payroll/dto/search-payroll.dto";
import {FilterTypeEnum} from "../../v1/payroll/entities/filter-type.enum";
import * as _ from "lodash";
import {timesheet} from "../../v1/payroll/functions/timesheet";
import {AllowanceSalary, DatetimeUnit, PartialDay, SalarySetting, SalaryType} from "@prisma/client";
import * as dateFns from "date-fns";
import {AbsentEntity} from "../../v1/payroll/entities/absent.entity";
import {OvertimeEntity} from "../../v1/salaries/overtime/entities";
import {RemoteEntity} from "../../v1/salaries/remote/entities/remote.entity";
import {AllowanceType, PayrollEntity} from "./entities";
import {HandleOvertimeEntity} from "./entities/handle-overtime.entity";
import {TAX} from "../../../common/constant";
import {HolidayEntity} from "../salaries/holiday/entities/holiday.entity";

@Injectable()
export class PayrollService {
  constructor(
    private readonly repository: PayrollRepository,
    private readonly employeeService: EmployeeService,
    private readonly salaryv2Service: SalaryService,
    private readonly allowanceSerivce: AllowanceService,
    private readonly absentService: AbsentService,
    private readonly overtimeService: OvertimeService,
    private readonly remoteService: RemoteService,
  ) {
  }

  async create(profile: ProfileEntity, body: CreatePayrollDto) {
    const employee = await this.employeeService.findOne(body.employeeId);
    return await this.repository.create(this.mapCreateToPayroll(body, employee)
    );
  }

  async createMany(profile: ProfileEntity, body: CreateManyPayrollDto) {
    const {data} = await this.employeeService.findAll(
      profile,
      {
        take: undefined,
        skip: undefined,
        createdAt: {
          datetime: lastDatetime(body.createdAt),
          compare: "lte"
        },
        status: EmployeeStatusEnum.WORKING
      }
    );
    const e = [];
    for (let i = 0; i < data.length; i++) {
      const payroll = await this.repository.findAll(profile, {
        startedAt: firstDatetime(body.createdAt),
        endedAt: lastDatetime(body.createdAt),
        employeeId: data[i].id,
      });

      if (!payroll.data.length) {
        e.push(this.mapCreateToPayroll(body, data[i]));
      }
    }
    const {count} = await this.repository.createMany(profile, e);
    return crudManyResponse(count, "creation");
  }

  async findAll(profile: ProfileEntity, search: Partial<SearchPayrollDto>) {
    const {total, data} = await this.repository.findAll(profile, search);

    switch (search.filterType) {
      case FilterTypeEnum.PERMANENT: {
        return {
          total,
          total2: await this.salaryv2Service.count(),
          data: data.map(e => Object.assign(e, {salaries: e.salariesv2}))
        };
      }
      case FilterTypeEnum.ALLOWANCE: {
        return {
          total,
          total2: await this.allowanceSerivce.count(),
          data: data.map(e => _.omit(Object.assign(e, {salaries: e.allowances})))
        };
      }
      case FilterTypeEnum.TIME_SHEET: {
        return {total, data: Object.assign(data, {timesheet: timesheet(data)})};
      }
      case FilterTypeEnum.OVERTIME: {
        const [total, data] = await Promise.all([
          this.overtimeService.count(search),
          this.overtimeService.groupBy(search)
        ]);

        return {total, total2: total, data};
      }
      case FilterTypeEnum.ABSENT: {
        return {
          total,
          total2: await this.absentService.count(),
          data: data.map(e => _.omit(Object.assign(e, {salaries: e.absents})))
        };
      }
      case FilterTypeEnum.REMOTE: {
        return {
          total,
          total2: await this.remoteService.count(),
          data: data.map(e => _.omit(Object.assign(e, {salaries: e.remotes})))
        };
      }
      default:
        return {total, data};
    }
  }

  async findOne(id: number) {
    const payroll = await this.repository.findOne(id);
    return this.mapToPayslip(payroll);
  }

  async update(profile: ProfileEntity, id: number, updates: UpdatePayrollDto) {
    return this.mapToPayslip(this.repository.update(profile, id, updates));
  }

  private totalSalaryCTL(payroll: PayrollEntity): number {
    const salary = payroll.salariesv2?.filter(salary => salary.type === SalaryType.BASIC_INSURANCE || salary.type === SalaryType.BASIC || salary.type === SalaryType.STAY).map(salary => {
      return salary.price * salary.rate;
    }).reduce((a, b) => a + b, 0);
    const allowance = payroll.allowances?.map(allowance => {
      return this.handleAllowance(allowance, payroll).total;
    }).reduce((a, b) => a + b, 0);
    const absent = payroll.absents?.map(absent => {
      const a = this.handleAbsent(absent, payroll);
      return a.price * a.duration;
    }).reduce((a, b) => a + b, 0);
    const deduction = payroll.deductions?.map(deduction => {
      return deduction.price;
    }).reduce((a, b) => a + b, 0);
    const overtime = _.flattenDeep(payroll.overtimes?.map(overtime => {
      return this.handleOvertimeOrHoliday(Object.assign(overtime, {type: "overtime"}), payroll).map(overtime => overtime.total);
    })).reduce((a, b) => a + b, 0);
    const holiday = _.flattenDeep(payroll.holidays?.map(overtime => {
      return this.handleOvertimeOrHoliday(Object.assign(overtime, {type: "overtime"}), payroll).map(overtime => overtime.total);
    })).reduce((a, b) => a + b, 0);
    const tax = payroll.taxed && payroll.tax ? (payroll.salariesv2?.find(salary => salary.type === SalaryType.BASIC_INSURANCE)?.price || 0) * payroll.tax : 0;
    return salary + allowance + overtime + holiday - absent - deduction - tax;
  }

  private handleAllowance(allowance: AllowanceSalary, payroll: PayrollEntity): { duration: number, total: number } {
    const allowances: Array<AllowanceType> = [];

    const absentRange = this.absentUniq(payroll);
    const remoteRange = this.remoteUniq(payroll);

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
  }

  private handleAbsent(absent: AbsentEntity, payroll: PayrollEntity): { duration: number, price: number } {
    const totalSetting = this.totalSetting(absent.setting, payroll);

    const datetimes = dateFns.eachDayOfInterval({
      start: absent.startedAt,
      end: absent.endedAt
    });
    return {
      duration: datetimes.length,
      price: totalSetting * datetimes.length
    };
  }

  private handleOvertimeOrHoliday(
    salary: OvertimeEntity | HolidayEntity,
    payroll: PayrollEntity
  ): Array<HandleOvertimeEntity> {
    const absentRange = this.absentUniq(payroll);
    let duration = this.getWorkday(payroll) - (payroll.workday || payroll.employee.workday);
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
        const totalSetting = this.totalSetting(overtime.setting, payroll);
        return Object.assign(overtime, {totalSetting});
      });
    return newOvertimes.map((salary) => Object.assign({}, salary, {
      price: salary.totalSetting,
      rate: salary.setting.rate,
      datetime: salary.datetime,
      total: salary.totalSetting * salary.duration * salary.setting.rate
    }));
  }

  private totalSetting(setting: SalarySetting, payroll: PayrollEntity): number {
    const totalOf = (setting.prices?.reduce((a, b) => a + b, 0) || setting.totalOf?.map(type => {
      return payroll.salariesv2?.filter(salary => salary.type === type).map((e) => e.price * e.rate).reduce((a, b) => a + b, 0);
    }).reduce((a, b) => a + b, 0));
    return totalOf / (setting.type !== SalaryType.OVERTIME ? (setting.workday || payroll.workday || payroll.employee.workday) : 1);
  }

  // private allowanceUniq(payroll: OnePayroll) {
  //   return this.uniq(payroll.allowances) as Array<AllowanceEntity & { datetime: Date }>;
  // }

  private absentUniq(payroll: PayrollEntity) {
    return this.uniq(payroll.absents) as Array<AbsentEntity & { datetime: Date }>;
  }

  private remoteUniq(payroll: PayrollEntity) {
    return this.uniq(payroll.remotes) as Array<RemoteEntity & { datetime: Date }>;
  }

  private uniq(items: Array<AbsentEntity | AllowanceSalary | RemoteEntity>): Array<AbsentEntity & { datetime: Date } | AllowanceSalary & { datetime: Date } | RemoteEntity & { datetime: Date }> {
    return _.sortBy(_.uniqBy(_.flattenDeep(items?.map(e => {
      const range = dateFns.eachDayOfInterval({
        start: e.startedAt,
        end: e.endedAt
      });
      return range.map(datetime => {
        return Object.assign({}, e, {datetime});
      });
    })), (e) => e.datetime.getTime()), (e) => e.datetime);
  }

  private getWorkday(payroll) {
    const absentDuration = payroll.absents?.map(absent => {
      return this.handleAbsent(absent, payroll).duration * (absent.partial === PartialDay.ALL_DAY ? 1 : 0.5);
    })?.reduce((a, b) => a + b, 0);
    return (dateFns.isSameMonth(new Date(), payroll.createdAt) ? new Date().getDate() + 1 : dateFns.getDaysInMonth(payroll.createdAt)) - (absentDuration + (payroll.createdAt.getDate() - 1));
  }

  private mapToPayslip(payroll) {
    // handle
    const allowances = payroll.allowances.map(allowance => {
      const a = this.handleAllowance(allowance, payroll as any);
      return Object.assign(allowance, {total: a.total, duration: a.duration});
    });
    const absents = payroll.absents?.map(absent => {
      const a = this.handleAbsent(absent, payroll as any);
      return Object.assign(absent, {
        price: a.price,
        duration: a.duration,
        total: a.price * a.duration * (absent.partial === PartialDay.ALL_DAY ? 1 : 0.5)
      });
    });
    const remotes = payroll.remotes?.map(remote => {
      const duration = dateFns.eachDayOfInterval({
        start: remote.startedAt,
        end: remote.endedAt
      }).length;
      return Object.assign(remote, {total: 0, duration: duration});
    });
    const overtimes = payroll.overtimes?.map(overtime => {
      const details = this.handleOvertimeOrHoliday(Object.assign(overtime, {type: "overtime"}), payroll as any);
      return Object.assign(overtime, {
        total: details.map(e => e.total).reduce((a, b) => a + b, 0),
        duration: details.map(e => e.duration).reduce((a, b) => a + b, 0),
        details: details,
      });
    });
    const holidays = payroll.holidays?.map(holiday => {
      const details = this.handleOvertimeOrHoliday(Object.assign(holiday, {type: "holiday"}), payroll as any);
      return Object.assign(holiday, {
        total: details.map(e => e.total).reduce((a, b) => a + b, 0),
        duration: details.map(e => e.duration).reduce((a, b) => a + b, 0),
        details: details,
      });
    });
    const total = this.totalSalaryCTL(payroll as any);

    return Object.assign(payroll, {
      actualday: this.getWorkday(payroll),
      allowances,
      absents,
      remotes,
      overtimes,
      holidays,
      total
    });
  }

  private mapCreateToPayroll(body, employee): CreatePayrollDto {
    return {
      createdAt: isEqualDatetime(body.createdAt, employee.createdAt, "month") ? employee.createdAt : body.createdAt,
      employeeId: body?.employeeId || employee.id,
      branch: employee.branch.name,
      position: employee.position.name,
      recipeType: employee.recipeType,
      workday: employee.workday,
      isFlatSalary: employee.isFlatSalary,
      taxed: employee.contracts?.length > 0,
      tax: employee.contracts?.length > 0 ? TAX : null,
    };
  }
}
