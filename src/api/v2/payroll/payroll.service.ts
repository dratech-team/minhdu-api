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
import {DatetimeUnit, PartialDay, SalaryType} from "@prisma/client";
import * as dateFns from "date-fns";
import {PayrollEntity} from "./entities";
import {TAX} from "../../../common/constant";
import {SalaryFunctions} from "./functions/salary.functions";
import {TimeSheet} from "./functions/timesheet.functions";

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
          data: data.map(e => Object.assign(e, {salaries: e.allowances}))
        };
      }
      case FilterTypeEnum.TIME_SHEET: {
        return {
          total, data: data.map(e => {
            return Object.assign(e, {timesheet: TimeSheet.timesheet(e)});
          })
        };
      }
      case FilterTypeEnum.SEASONAL: {
        break;
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
    const payroll = await this.repository.update(profile, id, updates);
    return this.mapToPayslip(payroll);
  }

  private mapToPayslip(payroll: PayrollEntity, isPayslip?: boolean) {
    const workday = payroll.workday || payroll.employee.workday;
    const actualDay = SalaryFunctions.getWorkday(payroll);

    const basicSalary = payroll.salariesv2?.filter(salary => salary.type === SalaryType.BASIC_INSURANCE || salary.type === SalaryType.BASIC)
      .reduce((a, b) => a + b.price * b.rate, 0);
    const basicInsuranceSalary = payroll.salariesv2?.filter(salary => salary.type === SalaryType.BASIC_INSURANCE)?.reduce((a, b) => a + b.price, 0) || 0;
    const staySalary = payroll.salariesv2?.filter(salary => salary.type === SalaryType.BASIC_INSURANCE || salary.type === SalaryType.BASIC)
      .reduce((a, b) => a + b.price * b.rate, 0);
    const allowances = payroll.allowances.map(allowance => {
      const a = SalaryFunctions.handleAllowance(allowance, payroll as any);
      return Object.assign(allowance, {total: a.total, duration: a.duration});
    });
    const absents = payroll.absents.map(absent => {
      const a = SalaryFunctions.handleAbsent(absent, payroll as any);
      return Object.assign(absent, {
        price: a.price,
        duration: a.duration,
        total: a.price * a.duration / (absent.setting.unit === DatetimeUnit.MINUTE ? 8 / 60 : 1) * (absent.partial !== PartialDay.ALL_DAY ? 0.5 : 1)
      });
    });
    const dayoffs = payroll.dayoffs.map(dayoff => {
      const a = SalaryFunctions.handleDayOff(dayoff, payroll as any);
      return Object.assign(dayoff, {
        duration: a.duration,
      });
    });
    const remotes = payroll.remotes.map(remote => {
      const duration = dateFns.eachDayOfInterval({
        start: remote.startedAt,
        end: remote.endedAt
      }).length;
      return Object.assign(remote, {total: 0, duration: duration});
    });
    const overtimes = payroll.overtimes.map(overtime => {
      const details = SalaryFunctions.handleOvertime(overtime, payroll as any);
      return Object.assign(overtime, {
        total: details.map(e => e.total).reduce((a, b) => a + b, 0),
        duration: details.map(e => e.duration).reduce((a, b) => a + b, 0),
        details: details,
      });
    });
    const holidays = payroll.holidays.map(holiday => {
      const details = SalaryFunctions.handleHoliday(holiday, payroll as any);
      return Object.assign(holiday, {
        total: details.map(e => e.total).reduce((a, b) => a + b, 0),
        duration: details.map(e => e.duration).reduce((a, b) => a + b, 0),
        details: details,
      });
    });

    //total
    const salary = basicSalary + staySalary;
    const allowanceSalary = allowances.reduce((a, b) => a + b.total, 0);
    const overtimeSalary = overtimes.reduce((a, b) => a + b.total, 0);
    const holidaySalary = holidays.reduce((a, b) => a + b.total, 0);
    const absentSalary = absents.reduce((a, b) => a + b.total, 0);
    const deductionSalary = payroll.deductions.reduce((a, b) => a + b.price, 0);
    const taxSalary = payroll.taxed && payroll.tax ? basicInsuranceSalary * payroll.tax : 0;
    const total = salary + allowanceSalary + overtimeSalary + holidaySalary - (absentSalary + deductionSalary + taxSalary);
    // if (isPayslip) {
    //   return {
    //     basicSalary: basicSalary,
    //     staySalary: staySalary,
    //     allowanceSalary: allowanceSalary,
    //     overtime: {
    //       duration: {
    //         day: overtimes.filter(overtime => overtime.setting.unit === DatetimeUnit.DAY).reduce((a, b) => a + b.duration, 0),
    //         hour: overtimes.filter(overtime => overtime.setting.unit === DatetimeUnit.HOUR).reduce((a, b) => a + b.duration, 0),
    //         minute: 0
    //       },
    //       total: overtimeSalary,
    //     },
    //     deductionSalary: deductionSalary,
    //     absent: {
    //       duration: {
    //         paidLeave: absents.filter(absent => absent.setting.type === SalaryType.ABSENT && absent.setting.rate === 1).reduce((a, b) => a + b.duration, 0),
    //         unpaidLeave: absents.filter(absent => absent.setting.type === SalaryType.ABSENT && absent.setting.rate === 1.5).reduce((a, b) => a + b.duration, 0),
    //       },
    //       total: absentSalary,
    //     },
    //     holiday: { /// TODO: handle tính working và unworking. working là những ngàylafm trong ngày lễ. unworking là ngày lễ nhưng vắng
    //       working: {duration: 1, total: 1},
    //       unworking: {duration: 1, total: 1},
    //     }
    //   } as PayslipEntity;
    // }
    return Object.assign(payroll, {
      actualday: SalaryFunctions.getWorkday(payroll),
      basicSalary: basicSalary,
      workday: workday,
      actualDay: actualDay,
      staySalary: staySalary,
      allowances: allowances,
      absents: absents,
      dayoffs: dayoffs,
      remotes: remotes,
      overtimes: overtimes,
      holidays: holidays,
      total: total
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

  async remove(profile: ProfileEntity, id: number) {
    return this.repository.remove(profile, id);
  }
}
