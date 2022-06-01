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
import {PartialDay, SalaryType} from "@prisma/client";
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
    const allowance = payroll.allowances.map(allowance => {
      return SalaryFunctions.handleAllowance(allowance, payroll).total;
    }).reduce((a, b) => a + b, 0);
    const absent = payroll.absents.map(absent => {
      const a = SalaryFunctions.handleAbsent(absent, payroll);
      return a.price * a.duration;
    }).reduce((a, b) => a + b, 0);
    const deduction = payroll.deductions.map(deduction => {
      return deduction.price;
    }).reduce((a, b) => a + b, 0);
    const overtime = _.flattenDeep(payroll.overtimes.map(overtime => {
      return SalaryFunctions.handleOvertime(overtime, payroll).map(overtime => overtime.total);
    })).reduce((a, b) => a + b, 0);
    const holiday = _.flattenDeep(payroll.holidays.map(holiday => {
      return SalaryFunctions.handleHoliday(holiday, payroll).map(overtime => overtime.total);
    })).reduce((a, b) => a + b, 0);
    const tax = payroll.taxed && payroll.tax ? (payroll.salariesv2?.find(salary => salary.type === SalaryType.BASIC_INSURANCE)?.price || 0) * payroll.tax : 0;
    return salary + allowance + overtime + holiday - absent - deduction - tax;
  }

  private mapToPayslip(payroll) {
    // handle
    const allowances = payroll.allowances.map(allowance => {
      const a = SalaryFunctions.handleAllowance(allowance, payroll as any);
      return Object.assign(allowance, {total: a.total, duration: a.duration});
    });
    const absents = payroll.absents.map(absent => {
      const a = SalaryFunctions.handleAbsent(absent, payroll as any);
      return Object.assign(absent, {
        price: a.price,
        duration: a.duration,
        total: a.price * a.duration * a.duration * (absent.partial !== PartialDay.ALL_DAY ? 0.5 : 1)
      });
    });
    const dayoff = payroll.dayoffs.map(dayoff => {
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
      const details = SalaryFunctions.handleOvertime(Object.assign(overtime, {type: "overtime"}), payroll as any);
      return Object.assign(overtime, {
        total: details.map(e => e.total).reduce((a, b) => a + b, 0),
        duration: details.map(e => e.duration).reduce((a, b) => a + b, 0),
        details: details,
      });
    });
    const holidays = payroll.holidays.map(holiday => {
      const details = SalaryFunctions.handleOvertime(Object.assign(holiday, {type: "holiday"}), payroll as any);
      return Object.assign(holiday, {
        total: details.map(e => e.total).reduce((a, b) => a + b, 0),
        duration: details.map(e => e.duration).reduce((a, b) => a + b, 0),
        details: details,
      });
    });
    const total = this.totalSalaryCTL(payroll as any);

    return Object.assign(payroll, {
      actualday: SalaryFunctions.getWorkday(payroll),
      allowances,
      absents,
      dayoff,
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
