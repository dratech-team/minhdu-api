import {BadRequestException, ConflictException, Injectable,} from "@nestjs/common";
import {DatetimeUnit, Payroll, RecipeType, Role, Salary, SalaryType,} from "@prisma/client";
import {Response} from "express";
import * as moment from "moment";
import {exportExcel} from "src/core/services/export.service";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {lastDatetimeOfMonth} from "../../../utils/datetime.util";
import {EmployeeService} from "../employee/employee.service";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {OnePayroll} from "./entities/payroll.entity";
import {PayrollRepository} from "./payroll.repository";
import {HolidayService} from "../holiday/holiday.service";
import * as _ from "lodash";

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
    return this.totalSalaryCT2(payroll);
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
      if (payroll.employee.recipeType === RecipeType.CT1) {
        await this.totalSalaryCT1(payroll);
      }
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
      .filter((salary) => salary.type === SalaryType.ABSENT)
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
   *
   *
   * CT2:
   * 1. actual >= workday                  => result = (basics / workday) x workday + stays + allowances
   * 2. actual < workday                  => result = [(basics + stays) / workday] x actual + allowances
   * 3. isFlat === true && absents !== 0  => actual = workday (Dù tháng đó có bao nhiêu ngày đi chăng nữa). else quay lại 1 & 2
   * */

  // CT1
  async totalSalaryCT1(payroll: OnePayroll) {
    const currentHoliday = await this.holidayService.findCurrentHolidays();
    const absent = this.totalAbsent(payroll.salaries);

    console.log("Vắng ", absent);
    console.log("Tổng ngày lễ của tháng này ", currentHoliday.length);

    const lastDayOfMonth = lastDatetimeOfMonth(payroll.createdAt).getDate();
    console.log("Ngày cuối cùng của tháng ", lastDayOfMonth);

    const actualWork = lastDayOfMonth - currentHoliday.length;
    console.log("Ngày  thực tế của tháng ", lastDayOfMonth - currentHoliday.length);

    const actualDay = lastDayOfMonth - absent.day;
    console.log("Ngày đi làm của nhân viên trên ngày thực tế", lastDayOfMonth - absent.day);

    // Ngày đi làm thực tế (lastDayOfMonth - absent.day) > Ngày thực tế của tháng (Trừ ngày lễ)
    if (actualDay > actualWork) {
      // Lấy ra all ngày vắng (không đi làm) trong ngày lễ.
      const absentsDate = payroll.salaries.filter(salary => salary.type === SalaryType.ABSENT && salary.unit === DatetimeUnit.DAY).map(salary => salary.datetime);

      // Chuyển về dạng format dd/MM/yyy rồi so sánh string để lấy ra các ngày nghỉ thuộc ngày lễ
      const absentsInHoliday = absentsDate.filter(absent => {
        return moment(absent).format('MM/DD/YYYY') === moment(payroll.createdAt).format('MM/DD/YYYY');
      });

      console.log("Nghỉ (Không đi làm) ngày lễ ", absentsInHoliday);

      // all ngày lễ trong tháng
      const daysInHoliday = currentHoliday.map(holiday => holiday.datetime.getDate());

      // all ngày nghỉ trong tháng thuộc ngày lễ
      const absentDayInHoliday = absentsInHoliday.map(absent => absent.getDate());

      console.log("Nghi ngày lễ ", absentDayInHoliday);
      console.log("Đi làm ngày lễ ",);

      daysInHoliday.map(day => {
        const a = _.remove(daysInHoliday, day);
        console.log(day)
        console.log(daysInHoliday)
        console.log(a)
      })

    }
  }

  /// TODO: handle holiday
  // CT2
  totalSalaryCT2(payroll: OnePayroll): TotalSalary {
    let tax = 0;
    let overtimeSalary = 0;
    let daySalary = 0;
    let total = 0;

    /// TH nhân viên nghỉ ngang. Thì sẽ confirm phiếu lương => phiếu lương không được sửa nữa. và lấy ngày hiện tại
    // let actualDay = !payroll.isEdit ? new Date().getDate() : lastDayOfMonth(payroll.createdAt) - this.totalAbsent(payroll.salaries).absent;
    /// FIXME: dummy for testing
    let actualDay =
      lastDatetimeOfMonth(payroll.createdAt).getDate() -
      this.totalAbsent(payroll.salaries).day;
    if (
      payroll.employee.isFlatSalary &&
      this.totalAbsent(payroll.salaries).day === 0 &&
      !payroll.isEdit
    ) {
      actualDay = 30;
    }

    // basic salary
    const basicSalary = payroll.salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.BASIC ||
          salary.type === SalaryType.BASIC_INSURANCE
      )
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0);

    // Lương ở lại
    const staySalary = payroll.salaries
      .filter((salary) => salary.type === SalaryType.STAY)
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0);

    // Phụ cấp theo tháng
    const allowanceMonthSalary = payroll.salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ALLOWANCE &&
          salary.unit === DatetimeUnit.MONTH
      )
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0);

    // Phụ cấp theo ngày, sẽ có unit là day và không có datetime (dựa vào ngày đi làm thực tế)
    const allowanceDayRangeSalary = payroll.salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ALLOWANCE &&
          salary.unit === DatetimeUnit.DAY &&
          salary.datetime
      )
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0);

    const allowanceDayByActual =
      payroll.salaries
        .filter(
          (salary) =>
            salary.type === SalaryType.ALLOWANCE &&
            salary.unit === DatetimeUnit.DAY &&
            !salary.datetime
        )
        .map((salary) => salary.price)
        .reduce((a, b) => a + b, 0) * actualDay;

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
      tax = payroll.employee.contracts.length !== 0 ? basic.price * 0.115 : 0;
    }

    // Tổng tiền đi trễ tính theo ngày. Nếu ngày đi làm chuẩn <= ngày thực tế
    const absentDaySalary =
      actualDay <= payroll.employee.workday
        ? this.totalAbsent(payroll.salaries).day * daySalary
        : 0;
    // Tổng tiền đi trễ tính theo  giờ
    const absentHourSalary =
      this.totalAbsent(payroll.salaries).hour * (daySalary / 8);
    // Tổng tiền đi trễ tính theo phút
    const absentHourMinuteSalary =
      this.totalAbsent(payroll.salaries).minute * (daySalary / 8 / 60);

    // Tổng tiền đi trễ
    const deductionSalary =
      absentDaySalary + absentHourSalary + absentHourMinuteSalary;

    const allowanceTotal =
      allowanceMonthSalary + allowanceDayByActual + allowanceDayRangeSalary;

    if (actualDay >= payroll.employee.workday) {
      total =
        daySalary * actualDay + Math.ceil(allowanceTotal) + staySalary - tax;
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
