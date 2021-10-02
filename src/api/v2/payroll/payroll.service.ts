import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {DatetimeUnit, Payroll, RecipeType, Role, Salary, SalaryType} from "@prisma/client";
import {Response} from "express";
import * as moment from "moment";
import {exportExcel} from "src/core/services/export.service";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {lastDatetimeOfMonth} from "../../../utils/datetime.util";
import {EmployeeService} from "../employee/employee.service";
import {HolidayService} from "../holiday/holiday.service";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {OnePayroll} from "./entities/payroll.entity";
import {PayrollRepository} from "./payroll.repository";
import {ALL_DAY, PARTIAL_DAY} from "../../../common/constant/datetime.constant";
import {RATE_OUT_OF_WORK_DAY, TAX} from "../../../common/constant/salary.constant";
import {includesDatetime, isEqualDatetime} from "../../../common/utils/isEqual-datetime.util";

@Injectable()
export class PayrollService {
  constructor(
    private readonly repository: PayrollRepository,
    private readonly employeeService: EmployeeService,
    private readonly holidayService: HolidayService
  ) {
  }

  async create(body: CreatePayrollDto) {
    try {
      throw new BadRequestException(
        "Phiếu lương sẽ được hệ thống tự động khởi tạo khi đến tháng mới"
      );
    } catch (err) {
      console.error(err);
      throw new ConflictException(err);
    }
  }

  async findAll(
    user: ProfileEntity,
    skip: number,
    take: number,
    search?: Partial<SearchPayrollDto>
  ) {
    const employee = await this.employeeService.findAll(
      user,
      undefined,
      undefined,
      {branchId: user.branchId}
    );

    ///
    for (let i = 0; i < employee.data.length; i++) {
      const payroll = await this.repository.findByEmployeeId(
        employee.data[i].id
      );

      if (!payroll) {
        await this.repository.create({
          employeeId: employee.data[i].id,
          createdAt: new Date(),
        });
      }
    }

    const data = await this.repository.findAll(user, skip, take, search);
    const payrolls = data.data.map((payroll) =>
      this.mapPayrollToPayslip(payroll)
    );

    return {total: data.total, data: payrolls};
  }

  async payslip(id: Payroll["id"]) {
    const payroll = await this.findOne(id);
    switch (payroll.employee.recipeType) {
      case  RecipeType.CT1: {
        return this.totalSalaryCT1(payroll);
      }
      case RecipeType.CT2: {
        return this.totalSalaryCT2(payroll);
      }
      default:
        throw new BadRequestException(`Loại lương của nhân viên ${payroll.employee.lastName} không xác định thuộc công thức nào. Vui lòng liên hệ admin để kiểm tra`)
    }
  }

  mapPayrollToPayslip(payroll) {
    return Object.assign(payroll, {
      payslip: payroll?.manConfirmedAt ? this.totalSalaryCT2(payroll) : null,
    });
  }

  async findOne(id: number): Promise<OnePayroll> {
    const payroll = await this.repository.findOne(id);
    if (!payroll) {
      throw new BadRequestException(`${id} không tồn tại..`);
    } else {
      // if (payroll.employee.recipeType === RecipeType.CT1) {
      //   await this.totalSalaryCT1(payroll);
      // }
      return Object.assign(this.mapPayrollToPayslip(payroll), {
        actualDay: this.totalSalaryCT2(payroll).actualDay,
      });
    }
  }

  async export(response: Response, user: ProfileEntity) {
    const payroll = await this.findAll(user, undefined, undefined);
    return exportExcel(
      response,
      {
        name: `Bảng lương tháng ${moment(payroll.data[0].createdAt).format(
          "MM/yyyy"
        )}`,
        title: `Bảng lương tháng ${moment(payroll.data[0].createdAt).format(
          "MM/yyyy"
        )}`,
        customHeaders: [],
        customKeys: [
          "employee",
          "basic",
          "stay",
          "allowance",
          "overtime",
          "workday",
          "actualDay",
        ],
        data: payroll.data,
      },
      200
    );
  }

  async findFirst(query: any): Promise<Payroll> {
    return await this.repository.findFirst(query);
  }

  /*
   * - Front end sẽ thêm salary mới và gửi id salary lên để connect vào phiếu lương
   *     + Nếu id salary thuộc type BASIC hoặc ALLOWANCE_STAYED thì sẽ được connect thêm tới lương của nhân viên
   *     + Ngược lại sẽ chỉ connect cho payroll
   * - Chặn edit phiếu lương sau khi phiếu lương đã xác nhận
   * - Quản lý xác phiếu lương,
   * - Quỹ Xác nhận đã thanh toán phiếu lương
   * */
  async update(id: number, updates: UpdatePayrollDto) {
    const payroll = await this.findOne(id);
    if (payroll.manConfirmedAt) {
      throw new BadRequestException(
        "Phiếu lương đã được xác nhận vì vậy bạn không có quyền sửa. Vui lòng liên hệ admin để được hỗ trợ."
      );
    }

    return await this.repository.update(id, updates);
  }

  async confirmPayroll(user: ProfileEntity, id: number) {
    switch (user.role) {
      case Role.CAMP_ACCOUNTING:
        return await this.repository.update(id, {accConfirmedAt: new Date()});
      case Role.CAMP_MANAGER:
        return await this.repository.update(id, {manConfirmedAt: new Date()});
      case Role.ACCOUNTANT_CASH_FUND:
        return await this.repository.update(id, {paidAt: new Date()});
      /// FIXME: dummy for testing
      case Role.HUMAN_RESOURCE:
        return await this.repository.update(id, {manConfirmedAt: new Date()});
      default:
        throw new BadRequestException(
          `${user.role} Bạn không có quyền xác nhận phiếu lương. Cảm ơn.`
        );
    }
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }

  totalAbsent(salaries: Salary[]) {
    /// absent có time = 0 và datetime nên sẽ có giá trị khơi
    let day = 0;
    let hour = 0;
    let minute = 0;
    const DAY = 1;

    salaries
      .filter((salary) => {
        return (
          salary.type === SalaryType.ABSENT ||
          salary.type === SalaryType.DAY_OFF
        );
      })
      .forEach((salary) => {
        switch (salary.unit) {
          case DatetimeUnit.DAY: {
            if (salary.datetime) {
              day += DAY;
            }
            break;
          }
          case DatetimeUnit.HOUR: {
            hour += salary.times;
            break;
          }
          case DatetimeUnit.MINUTE: {
            minute += salary.times;
            break;
          }
          default:
            console.error("LDatetimeUnit Unknown");
        }
      });

    return {day, hour, minute};
  }

  totalAllowanceByActual(salaries: Salary[], actualDay: number) {
    return salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ALLOWANCE &&
          salary.unit === DatetimeUnit.DAY &&
          !salary.datetime
      )
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0) * actualDay;
  }

  totalAllowanceDayRangeSalary(salaries: Salary[]) {
    return salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ALLOWANCE &&
          salary.unit === DatetimeUnit.DAY &&
          salary.datetime
      )
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0);
  }

  totalAllowanceMonthSalary(salaries: Salary[]) {
    return salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ALLOWANCE &&
          salary.unit === DatetimeUnit.MONTH
      )
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0);
  }

  totalStaySalary(salaries: Salary[]) {
    return salaries
      .filter((salary) => salary.type === SalaryType.STAY)
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0);
  }

  totalBasicSalary(salaries: Salary[]) {
    return salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.BASIC ||
          salary.type === SalaryType.BASIC_INSURANCE
      )
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0);
  }

  /*
   * Tổng lương: result
   * Ngày làm thực tế: actual
   * Ngày công chuẩn: workday
   * Tổng lương cơ bản: basics
   * Tổng phụ cấp ở lại: stays
   * Tổng phụ cấp khác: allowances
   * Lương cố định: isFlat
   * Tổng ngày vắng: absents
   *
   * CT1:
   * - Nếu ngày đi làm thực tế  > ngày thực tế của tháng => các ngày đi làm trong ngày lễ sẽ được hưởng mức nhân lương theo quy định
   * */


  /*
  *    basicSalary: Lương cơ bản trích bảo hiểm
   *   totalStandard: Tổng lương cơ bản chuẩn = Cụm lương cơ bản + phụ cấp ở lại
   *   workday: Ngày làm việc chuẩn
   *   workdayNotInHoliday: Ngày làm việc trừ ngày lễ
   *   worksInHoliday: Ngày làm việc thuộc ngày lễ
   *   worksNotInHoliday: Ngày lễ nhưng không đi làm. sẽ được tính theo lương cơ bản. Không rate
   *   totalWorkday; Tổng ngày làm việc theo ngày công chuẩn
    *  payslipNormalDay: Tổng tiền theo ngày làm việc bình thường
    *  payslipInHoliday:  Tổng tiền theo ngày làm việc trong ngày lễ (đã rate)
    *  payslipNotInHoliday: Tổng tiền c trong ngày lễ nhưng không đi làm (tính theo lương cơ bản)
    *  staySalary: Tổng phụ cấp ở lại
    * payslipOutOfWorkday: Tổng tiền ngoài giờ làm việc chính thức. ngày đi làm thực tế > ngày đi làm công chuẩn => Những ngày còn lại sẽ được RATE_OUT_OF_WORK_DAY (x2) tùy theo quy định.
   */

  // CT1
  async totalSalaryCT1(payroll: OnePayroll) {
    let payslipInHoliday = 0;
    let payslipNotInHoliday = 0;
    let payslipOutOfWorkday = 0;

    const lastDayOfMonth = lastDatetimeOfMonth(payroll.createdAt).getDate();

    let basic = payroll.salaries.find(
      (salary: Salary) => salary.type === SalaryType.BASIC_INSURANCE
    );

    const basicDaySalary = basic.price / payroll.employee.workday;

    const currentHoliday = await this.holidayService.findCurrentHolidays();

    // Tổng ngày công thực tế trừ ngày lễ
    // const actualDayExceptHoliday = new Date().getDate() - currentHoliday.length;
    /// FIXME: Dummy data
    const workdayNotInHoliday = lastDayOfMonth - currentHoliday.length;

    // Ngày công chuẩn
    const workday = payroll.employee.workday;

    // Tổng lương ngày  công thực tế trừ ngày lễ
    const payslipNormalDay = basic.price / workday * workdayNotInHoliday;

    const absent = this.totalAbsent(payroll.salaries);

    const actualDay = lastDayOfMonth - absent.day;

    // Tính tiền đi làm trong nggày lễ cho 1 ngày và nửa ngàu thường
    if (currentHoliday && currentHoliday.length) {
      for (let i = 0; i < currentHoliday.length; i++) {
        const salaries = payroll.salaries.filter(salary => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF);
        const isAbsentInHoliday = includesDatetime(salaries.map(salary => salary.datetime), currentHoliday[i].datetime);
        if (isAbsentInHoliday) {
          const salary = salaries.find(salary => isEqualDatetime(salary.datetime, currentHoliday[i].datetime));
          if (salary.times === 1) {
            // không đi làm sẽ được tính theo lương cơ bản bth
            payslipNotInHoliday += basicDaySalary;
          } else if (salary.times === 0.5) {
            // nửa ngày lễ nghỉ tính giá thường k nhân
            payslipNotInHoliday += basicDaySalary / 2;
            // nửa ngày lễ đi làm  tính giá nửa ngày nhân hệ số
            // nếu nó là ngày tết isConstraint = false. k bị ràng buộc bởi ngày làm thực tế thì vẫn sẽ được nhân hệ số dù có di làm đủ ngày công hay k đi chăng nữa.
            // ngược lại nhân hay k sẽ bị phụ thuộc vào ngày công so với ngày công chuẩn
            if (!currentHoliday[i].isConstraint || currentHoliday[i].isConstraint && actualDay >= workday) {
              payslipInHoliday += (basic.price / payroll.employee.workday / 2) * currentHoliday[i].rate;
            } else {
              payslipInHoliday += (basic.price / payroll.employee.workday / 2);
            }

          } else {
            throw new BadRequestException(
              `${payroll.employee.lastName} ngày ${payroll.createdAt} có thời gian làm ngày lễ không hợp lệ`
            );
          }
        } else {
          if (!currentHoliday[i].isConstraint || currentHoliday[i].isConstraint && actualDay >= workday) {
            payslipInHoliday += (basic.price / workday) * currentHoliday[i].rate;
          } else {
            payslipInHoliday += (basic.price / workday)
          }
        }
      }
    }

    // Đi làm nhưng không thuộc ngày lễ x2
    if (actualDay - (currentHoliday.length + workday) > 0) {
      payslipOutOfWorkday = actualDay - (currentHoliday.length + workday) * basicDaySalary * RATE_OUT_OF_WORK_DAY;
    }

    const allowanceDayByActual = this.totalAllowanceByActual(payroll.salaries, actualDay);

    const allowanceDayRangeSalary = this.totalAllowanceDayRangeSalary(payroll.salaries);

    const allowanceMonthSalary = this.totalAllowanceMonthSalary(payroll.salaries);

    const staySalary = actualDay >= workday ? this.totalStaySalary(payroll.salaries) : this.totalStaySalary(payroll.salaries) / workday * actualDay;

    const allowanceTotal = allowanceMonthSalary + allowanceDayByActual + allowanceDayRangeSalary;

    const tax = payroll.employee.contracts.length ? basic.price * TAX : 0;

    const absents = payroll.salaries.filter(salary => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF);

    const worksInHoliday = [];
    const worksNotInHoliday = [];
    // Get ngày Không đi làm trong ngày lễ để hiển thị ra UI
    currentHoliday.forEach(holiday => {
      const absentsDate = absents.map(absent => absent.datetime);
      if (includesDatetime(absentsDate, holiday.datetime)) {
        if (absents.find(absent => isEqualDatetime(absent.datetime, holiday.datetime)).times === PARTIAL_DAY) {
          worksInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime, rate: holiday.rate});
          worksNotInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime, rate: holiday.rate});
        } else {
          worksNotInHoliday.push({day: ALL_DAY, datetime: holiday.datetime, rate: holiday.rate});
        }
      } else {
        worksInHoliday.push({day: ALL_DAY, datetime: holiday.datetime, rate: holiday.rate});
      }
    });

    const totalWorkday = worksInHoliday.map(work => work.day).reduce((a, b) => a + b, 0) + workdayNotInHoliday;
    const totalStandard = basic.price + staySalary;

    return {
      basicSalary: basic.price,
      totalStandard,
      workday,
      workdayNotInHoliday,
      worksInHoliday,
      worksNotInHoliday,
      totalWorkday,
      payslipNormalDay,
      payslipInHoliday,
      payslipNotInHoliday,
      staySalary,
      payslipOutOfWorkday,
      tax,
      total: payslipNormalDay + payslipInHoliday + payslipOutOfWorkday + staySalary + allowanceTotal + -tax
    };
  }

  /**
   *CT2:
   * 1. actual >= workday                  => result = (basics / workday) x workday + stays + allowances
   * 2. actual < workday                  => result = [(basics + stays) / workday] x actual + allowances
   * 3. isFlat === true && absents !== 0  => actual = workday (Dù tháng đó có bao nhiêu ngày đi chăng nữa). else quay lại 1 & 2
   */
  // CT2
  totalSalaryCT2(payroll: OnePayroll): TotalSalary {
    let tax = 0;
    let overtimeSalary = 0;
    let daySalary = 0;
    let total = 0;

    /// TH nhân viên nghỉ ngang. Thì sẽ confirm phiếu lương => phiếu lương không được sửa nữa. và lấy ngày hiện tại
    // let actualDay = !payroll.isEdit ? new Date().getDate() : lastDayOfMonth(payroll.createdAt) - this.totalAbsent(payroll.salaries).absent;
    /// FIXME: dummy for testing
    let actualDay = lastDatetimeOfMonth(payroll.createdAt).getDate() - this.totalAbsent(payroll.salaries).day;
    if (payroll.employee.isFlatSalary && this.totalAbsent(payroll.salaries).day === 0 && !payroll.isEdit) {
      actualDay = 30;
    }

    // basic salary
    const basicSalary = this.totalBasicSalary(payroll.salaries);

    // Lương ở lại
    const staySalary = this.totalStaySalary(payroll.salaries);

    // Phụ cấp theo tháng
    const allowanceMonthSalary = this.totalAllowanceMonthSalary(payroll.salaries);

    // Phụ cấp theo ngày, sẽ có unit là day và không có datetime (dựa vào ngày đi làm thực tế)
    const allowanceDayRangeSalary = this.totalAllowanceDayRangeSalary(payroll.salaries);

    const allowanceDayByActual = this.totalAllowanceByActual(payroll.salaries, actualDay);

    if (actualDay >= payroll.employee.workday) {
      daySalary = basicSalary / payroll.employee.workday;
    } else {
      daySalary = (basicSalary + staySalary) / payroll.employee.workday;
    }

    const basic = payroll.salaries.find(
      (salary) => salary.type === SalaryType.BASIC_INSURANCE
    );

    // Thuế dựa theo lương cơ bản BASIC_INSURANCE
    if (basic) {
      tax = payroll.employee.contracts.length !== 0 ? basic.price * TAX : 0;
    }

    // Tổng tiền đi trễ tính theo ngày. Nếu ngày đi làm chuẩn <= ngày thực tế
    const absentDaySalary =
      actualDay <= payroll.employee.workday
        ? this.totalAbsent(payroll.salaries).day * daySalary
        : 0;
    // Tổng tiền đi trễ tính theo  giờ
    const absentHourSalary = this.totalAbsent(payroll.salaries).hour * (daySalary / 8);
    // Tổng tiền đi trễ tính theo phút
    const absentHourMinuteSalary = this.totalAbsent(payroll.salaries).minute * (daySalary / 8 / 60);

    // Tổng tiền đi trễ
    const deductionSalary = absentDaySalary + absentHourSalary + absentHourMinuteSalary;

    const allowanceTotal = allowanceMonthSalary + allowanceDayByActual + allowanceDayRangeSalary;

    if (actualDay >= payroll.employee.workday) {
      total = daySalary * actualDay + Math.ceil(allowanceTotal) + staySalary - tax;
    } else {
      total = daySalary * actualDay + Math.ceil(allowanceTotal) - tax;
    }
    return {
      basic: Math.ceil(basicSalary),
      stay: Math.ceil(staySalary),
      overtime: overtimeSalary,
      allowance: Math.ceil(allowanceMonthSalary + allowanceTotal * actualDay),
      deduction: deductionSalary,
      daySalary,
      actualDay: actualDay,
      workday: payroll.employee.workday,
      salaryActual: Math.ceil(daySalary * actualDay),
      tax,
      total: Math.round(total / 1000) * 1000,
    };
  }
}

type TotalSalary = {
  basic: number;
  stay: number;
  overtime: number;
  allowance: number;
  deduction: number;
  daySalary: number;
  actualDay: number;
  workday: number;
  salaryActual: number;
  tax: number;
  total: number;
};
