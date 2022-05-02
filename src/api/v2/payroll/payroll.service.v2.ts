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
import {AllowanceSalary, PartialDay, SalaryType} from "@prisma/client";
import {OnePayroll} from "./entities/payroll.entity";
import {SettingPayslipsEntity} from "./entities/payslips";
import * as _ from "lodash";
import * as dateFns from 'date-fns';
import {AllowanceEntity} from "../salaries/allowance/entities";
import {uniqDatetime} from "./functions/uniqDatetime";

type AllowanceType = AllowanceEntity & { datetime: Date };
type HandleAllowancetype = {
  readonly allowancesInWorkday: AllowanceType[];
  readonly allowancesInOffice: AllowanceType[];
  readonly allowancesInWorkdayAndOffice: AllowanceType[];
  readonly allowances: AllowanceType[];
};


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
    const payroll = _.omit(found, "payrollIds");
    this.totalSalaryCTL(payroll as any);
    return found;
  }

  private totalSalaryCTL(payroll: OnePayroll) {
    const salary = this.totalSalary(payroll);
    const allowance = this.totalAllowance(payroll);
    const absent = this.totalAbsent(payroll);
    const overtime = this.totalOvertime(payroll);
    const deduction = this.totalDeduction(payroll);
  }

  // Những khoảng cố định. Không ràng buộc bởi ngày công thực tế. Bao gồm lương cơ bản và phụ cấp lương (phụ cấp ở lại)
  private totalSalary(payroll: OnePayroll) {
    return payroll.salaries.filter(salary => salary.type === SalaryType.BASIC_INSURANCE).map(salary => {
      if (!payroll.taxed && salary.type === SalaryType.BASIC_INSURANCE) {
        return salary.price * 1;
      }
      return salary.price * salary.rate;
    }).reduce((a, b) => a + b, 0);
  }

  private totalAllowance(payroll: OnePayroll): number {
    return payroll.allowances?.map(allowance => {
      const a = this.handleAllowance(allowance, payroll);
      return this.allowanceReduce(a.allowancesInWorkday) + this.allowanceReduce(a.allowancesInOffice) + this.allowanceReduce(a.allowancesInWorkdayAndOffice) + this.allowanceReduce(a.allowances);
    }).reduce((a, b) => a + b, 0);
  }

  private totalAbsent(payroll: OnePayroll): number {
    const allday = [];
    const partialday = [];
    const minutes = [];

    return payroll.absents.map(absent => {
      const setting = this.totalSetting(Object.assign(absent.setting, {
        workday: absent.setting.workday,
        salaries: absent.salaries
      }) as SettingPayslipsEntity);

      const datetimes = dateFns.eachDayOfInterval({
        start: absent.startedAt,
        end: absent.endedAt
      });

      if (absent.partial === PartialDay.ALL_DAY) {
        // 1 day
      } else if (absent.partial === PartialDay.MORNING || absent.partial === PartialDay.AFTERNOON) {
        // 1/2 day
      } else {
        // minutes
      }
      return setting;
    }).reduce((a, b) => a + b, 0);
  }

  private totalDeduction(payroll: OnePayroll) {
    return payroll.deductions.map(deduction => {
      return deduction.price;
    }).reduce((a, b) => a + b, 0);
  }

  private totalOvertime(payroll: OnePayroll): number {
    return payroll.overtimes.map(overtime => {
      const allowance = this.allowanceReduce(overtime.allowances);
      const setting = this.totalSetting(
        Object.assign(overtime.setting, {
          workday: overtime.setting.workday,
          salaries: payroll.salariesv2
        }) as SettingPayslipsEntity
      );
      // return allowances + settings;
      return setting + allowance;
    }).reduce((a, b) => a + b, 0);
  }

  private totalSetting(setting: SettingPayslipsEntity): number {
    const totalOf = setting.totalOf.map(type => {
      return setting.salaries.filter(salary => salary.type === type).map((e) => e.price * e.rate).reduce((a, b) => a + b, 0);
    }).reduce((a, b) => a + b, 0) + setting.prices?.reduce((a, b) => a + b, 0);

    return totalOf / setting.workday;
  }

  private allowanceReduce(allowance: Array<AllowanceEntity | AllowanceSalary>) {
    return allowance.map(allowance => allowance.price * allowance.rate).reduce((a, b) => a + b, 0);
  }

  private handleAllowance(allowance: AllowanceEntity, payroll: OnePayroll): HandleAllowancetype {
    const allowancesInWorkday: Array<AllowanceType> = [];
    const allowancesInOffice: Array<AllowanceType> = [];
    const allowancesInWorkdayAndOffice: Array<AllowanceType> = [];
    const allowances: Array<AllowanceType> = [];

    const absentRange = uniqDatetime(_.flattenDeep(payroll.absents?.map(absent => dateFns.eachDayOfInterval({
      start: absent.startedAt,
      end: absent.endedAt
    })))).map(datetime => datetime.getTime());

    const remoteRange = uniqDatetime(_.flattenDeep(payroll.remotes?.map(remote => dateFns.eachDayOfInterval({
      start: remote.startedAt,
      end: remote.endedAt
    })))).map(datetime => datetime.getTime());

    const datetimes = dateFns.eachDayOfInterval({
      start: allowance.startedAt,
      end: allowance.endedAt
    });

    datetimes.forEach(datetime => {
      const exist = (allowance.inWorkday ? allowancesInWorkday : allowance.inOffice ? allowancesInOffice : allowances)
        .map(allowance => allowance.datetime.getTime()).includes(datetime.getTime());

      if (!exist) {
        if (allowance.inWorkday) {
          if (!absentRange.includes(datetime.getTime())) {
            allowancesInWorkday.push(Object.assign({}, allowance, {datetime: datetime}));
          }
        } else if (allowance.inOffice) {
          if (!remoteRange.includes(datetime.getTime())) {
            allowancesInOffice.push(Object.assign({}, allowance, {datetime: datetime}));
          }
        } else if (allowance.inWorkday && allowance.inOffice) {
          if (!remoteRange.includes(datetime.getTime()) && !absentRange.includes(datetime.getTime())) {
            allowancesInWorkdayAndOffice.push(Object.assign({}, allowance, {datetime: datetime}));
          }
        } else {
          allowances.push(Object.assign({}, allowance, {datetime: datetime}));
        }
      }
    });
    return {
      allowancesInWorkday,
      allowancesInOffice,
      allowancesInWorkdayAndOffice,
      allowances,
    };
  }

  private mapToPayroll(body) {

  }
}
