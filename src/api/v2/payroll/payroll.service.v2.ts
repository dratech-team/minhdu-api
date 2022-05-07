import {Injectable} from "@nestjs/common";
import {PayrollRepository} from "./payroll.repository";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {firstDatetime, lastDatetime} from "../../../utils/datetime.util";
import {StatusEnum} from "../../../common/enum/status.enum";
import {isEqualDatetime} from "../../../common/utils/isEqual-datetime.util";
import {EmployeeService} from "../employee/employee.service";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {FilterTypeEnum} from "./entities/filter-type.enum";
import {timesheet} from "./functions/timesheet";
import {AllowanceSalary, PartialDay, SalarySetting, SalaryType} from "@prisma/client";
import {OnePayroll} from "./entities/payroll.entity";
import * as _ from "lodash";
import * as dateFns from 'date-fns';
import {AbsentEntity} from "./entities/absent.entity";
import {RemoteEntity} from "../salaries/remote/entities/remote.entity";
import {AllowanceEntity} from "../salaries/allowance/entities";
import {OvertimeEntity} from "../salaries/overtime/entities";

type AllowanceType = AllowanceSalary & { datetime: Date, duration: number };

@Injectable()
export class PayrollServicev2 {
  constructor(
    private readonly repository: PayrollRepository,
    private readonly employeeService: EmployeeService,
  ) {
  }

  async create(profile: ProfileEntity, body: CreatePayrollDto) {
    // Tạo hàng loạt
    if (!body?.employeeId) {
      const {data} = await this.employeeService.findAll(
        profile,
        {
          take: undefined,
          skip: undefined,
          createdAt: {
            datetime: lastDatetime(body.createdAt),
            compare: "lte"
          },
          status: StatusEnum.NOT_ACTIVE
        }
      );
      const createds = [];
      for (let i = 0; i < data.length; i++) {
        const payrolls = await this.repository.findAll(profile, {
          startedAt: firstDatetime(body.createdAt),
          endedAt: lastDatetime(body.createdAt),
          employeeId: data[i].id,
        });

        if (!payrolls.data.length) {
          const created = await this.repository.create(Object.assign(body, {
            createdAt: isEqualDatetime(body.createdAt, data[i].createdAt, "month") ? data[i].createdAt : body.createdAt,
            employeeId: data[i].id,
            branch: data[i].branch,
            position: data[i].position,
            recipeType: data[i].recipeType,
            workday: data[i].workday,
            isFlatSalary: data[i].isFlatSalary
          }));
          createds.push(created);
        }
      }

      return {
        status: 201,
        message: `Đã tự động tạo phiếu lương tháng ${body.createdAt} cho ${createds.length} nhân viên`,
      };
    } else {
      // Tạo 1
      const employee = await this.employeeService.findOne(body.employeeId);
      // if (moment(employee.createdAt).isAfter(body.createdAt)) {
      //   throw new BadRequestException(`Không được tạo phiếu lương trước ngày nhân viên vào làm. Xin cảm ơn`);
      // }
      return await this.repository.create(Object.assign(body, {
        employeeId: employee.id,
        branch: employee.branch,
        position: employee.position,
        recipeType: employee.recipeType,
        workday: employee.workday,
        isFlatSalary: employee.isFlatSalary,
      }), true);
    }
  }

  async findAll(profile: ProfileEntity, search?: Partial<SearchPayrollDto>) {
    const {total, data} = await this.repository.findAll(profile, search);

    return {
      total,
      data: data.map(payroll => {
        switch (search.filterType) {
          case FilterTypeEnum.TIME_SHEET: {
            return Object.assign(payroll, {timesheet: timesheet(payroll)});
          }
          case FilterTypeEnum.PAYROLL: {
          }
        }
      })
    };
  }

  async findOne(id: number) {
    const found = await this.repository.findOne(id);

    const allowances = found.allowances.map(allowance => {
      const a = this.handleAllowance(allowance, found as any);
      return Object.assign(allowance, {total: a.total, duration: a.duration});
    });
    const absents = found.absents?.map(absent => {
      const a = this.handleAbsent(absent, found as any);
      return Object.assign(absent, {
        price: a.price,
        duration: a.duration,
        total: a.price * a.duration * (absent.partial === PartialDay.ALL_DAY ? 1 : 0.5)
      });
    });

    const remotes = found.remotes?.map(remote => {
      const duration = dateFns.eachDayOfInterval({
        start: remote.startedAt,
        end: remote.endedAt
      }).length;
      return Object.assign(remote, {total: 0, duration: duration});
    });

    const overtimes = found.overtimes?.map(overtime => {
      const details = this.handleOvertime(overtime, found as any);
      return {
        overtime: Object.assign(overtime, {
          total: details.map(e => e.total).reduce((a, b) => a + b, 0),
          duration: details.map(e => e.duration).reduce((a, b) => a + b, 0),
        }),
        details: details
      };
    });

    // const deductions = found.
    // this.totalSalaryCTL(found as any);
    return Object.assign(found, {actualday: this.getWorkday(found), allowances, absents, remotes, overtimes});
  }

  private totalSalaryCTL(payroll: OnePayroll) {
    const salary = this.totalSalary(payroll);
    const allowance = this.totalAllowance(payroll);
    // const absent = this.handleAbsent(payroll.absents, payroll);
    const deduction = payroll.deductions?.map(deduction => {
      return deduction.price;
    }).reduce((a, b) => a + b, 0);
  }

  // Những khoảng cố định. Không ràng buộc bởi ngày công thực tế. Bao gồm lương cơ bản và phụ cấp lương (phụ cấp ở lại)
  private totalSalary(payroll: OnePayroll) {
    return payroll.salariesv2?.filter(salary => salary.type === SalaryType.BASIC_INSURANCE || salary.type === SalaryType.BASIC || salary.type === SalaryType.STAY).map(salary => {
      if (!payroll.taxed && salary.type === SalaryType.BASIC_INSURANCE) {
        return salary.price * 1;
      }
      return salary.price * salary.rate;
    }).reduce((a, b) => a + b, 0);
  }

  private totalAllowance(payroll: OnePayroll): number {
    return payroll.allowances?.map(allowance => {
      return this.handleAllowance(allowance, payroll).total;
    }).reduce((a, b) => a + b, 0);
  }

  private handleAllowance(allowance: AllowanceSalary, payroll: OnePayroll): { duration: number, total: number } {
    const allowances: Array<AllowanceType> = [];

    const absentRange = this.absentUniq(payroll);
    const remoteRange = this.remoteUniq(payroll);

    const datetimes = dateFns.eachDayOfInterval({
      start: allowance.startedAt,
      end: allowance.endedAt
    });

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
      total: allowance.price * allowance.rate * duration,
    };
  }

  private handleAbsent(absent: AbsentEntity, payroll: OnePayroll): { duration: number, price: number } {
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

  private handleOvertime(
    overtime: OvertimeEntity,
    payroll: OnePayroll
  ): Array<OvertimeEntity & { price: number, rate: number, datetime: Date, duration: number, total: number }> {
    const absentRange = this.absentUniq(payroll);
    let duration = this.getWorkday(payroll) - (payroll.workday || payroll.employee.workday);

    const datetimes = dateFns.eachDayOfInterval({
      start: overtime.startedAt,
      end: overtime.endedAt
    });

    const newOvertimes = datetimes.map(datetime => Object.assign({}, overtime, {datetime}))
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
    return newOvertimes.map(overtime => Object.assign({}, overtime, {
      price: overtime.totalSetting,
      rate: overtime.setting.rate,
      datetime: overtime.datetime,
      duration: overtime.partial !== PartialDay.ALL_DAY ? 0.5 : 1,
      total: overtime.totalSetting * (overtime.partial !== PartialDay.ALL_DAY ? 0.5 : 1) * overtime.setting.rate
    }));
  }

  private totalSetting(setting: SalarySetting, payroll: OnePayroll): number {
    const totalOf = (setting.prices?.reduce((a, b) => a + b, 0) || setting.totalOf?.map(type => {
      return payroll.salariesv2?.filter(salary => salary.type === type).map((e) => e.price * e.rate).reduce((a, b) => a + b, 0);
    }).reduce((a, b) => a + b, 0));
    return totalOf / (setting.type !== SalaryType.OVERTIME ? (setting.workday || payroll.workday || payroll.employee.workday) : 1);
  }

  private allowanceUniq(payroll: OnePayroll) {
    return this.uniq(payroll.allowances) as Array<AllowanceEntity & { datetime: Date }>;
  }

  private absentUniq(payroll: OnePayroll) {
    return this.uniq(payroll.absents) as Array<AbsentEntity & { datetime: Date }>;
  }

  private remoteUniq(payroll: OnePayroll) {
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

  private mapToPayroll(body) {

  }
}
