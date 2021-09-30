import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {DatetimeUnit, Payroll, Role, Salary, SalaryType} from "@prisma/client";
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
import {DatetimeFormat} from "../../../common/constant/datetime.constant";

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
    return this.totalSalaryCT1(payroll);
    // return this.totalSalaryCT2(payroll);
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

  // CT1
  async totalSalaryCT1(payroll: OnePayroll) {
    let totalBasicSalary = 0;
    let totalSalaryHoliday = 0;
    let totalNoWorkInHoliday = 0;
    let totalNotHoliday = 0;
    let RATE_WORK_NOT_HOLIDAY = 2;

    let basic = payroll.salaries.find(
      (salary: Salary) => salary.type === SalaryType.BASIC_INSURANCE
    );

    const currentHoliday = await this.holidayService.findCurrentHolidays();
    const absent = this.totalAbsent(payroll.salaries);

    const lastDayOfMonth = lastDatetimeOfMonth(payroll.createdAt).getDate();

    const actualDay = lastDayOfMonth - absent.day;

    // Ngày làm việc thực tế trừ ngày lễ
    const actualDayNotHoliday = payroll.salaries.filter(
      (salary: Salary) =>
        !currentHoliday
          .map((holiday) => moment(holiday.datetime).format(DatetimeFormat))
          .includes(moment(salary.datetime).format(DatetimeFormat))
    );


    // Ngày đi làm thực tế (lastDayOfMonth - absent.day) > Ngày công chuẩn
    if (actualDay >= payroll.employee.workday) {
      // Get ngày đi làm trong ngày lễ
      const notAbsent = payroll.salaries.filter(salary => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF).map(salary => moment(salary.datetime).format(DatetimeFormat));
      const worksInHoliday = currentHoliday.map(holiday => moment(holiday.datetime).format(DatetimeFormat)).filter(h => !notAbsent.includes(h))

      console.log("Đi làm ngày lễ", worksInHoliday);

      for (let i = 0; i < worksInHoliday.length; i++) {
        const work = currentHoliday.find(holiday => moment(holiday.datetime).format(DatetimeFormat) === worksInHoliday[i]);
        totalSalaryHoliday += (basic.price / payroll.employee.workday) * work.rate;
      }

      if (currentHoliday && currentHoliday.length) {
        for (let i = 0; i < currentHoliday.length; i++) {
          for (let j = 0; j < payroll.salaries.length; j++) {
            const isAbsent =
              payroll.salaries[i].type === SalaryType.ABSENT ||
              (payroll.salaries[i].type === SalaryType.DAY_OFF &&
                moment(currentHoliday[i].datetime).format(DatetimeFormat) ===
                moment(payroll.salaries[j].datetime).format(DatetimeFormat));

            if (isAbsent) {
              if (payroll.salaries[j].times === 1) {
                totalNoWorkInHoliday += basic.price / payroll.employee.workday;
              } else if (payroll.salaries[j].times === 0.5) {
                // nửa ngày lễ nghỉ tính giá thường k nhân
                totalNoWorkInHoliday +=
                  basic.price / payroll.employee.workday / 2;

                totalSalaryHoliday +=
                  (basic.price / payroll.employee.workday / 2) *
                  currentHoliday[i].rate;
              } else {
                throw new BadRequestException(
                  `${payroll.employee.lastName} ngày ${payroll.createdAt} có thời gian làm ngày lễ không hợp lệ`
                );
              }
            }
          }
        }
      }

      // Đi làm nhưng không thuộc ngày lễ x2
      if (actualDay - currentHoliday.length > 0) {
        totalNotHoliday =
          ((actualDay - currentHoliday.length) *
            RATE_WORK_NOT_HOLIDAY *
            basic.price) /
          payroll.employee.workday;
      }
    } else {
      this.totalSalaryCT2(payroll);
    }

    totalBasicSalary = payroll.salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.BASIC ||
          salary.type === SalaryType.BASIC_INSURANCE
      )
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0);

    console.log("Tổng tiền đi làm ngày lễ ", totalSalaryHoliday);
    console.log(
      "Tổng tiền đi làm ngày thường ",
      (actualDayNotHoliday.length * basic.price) / payroll.employee.workday
    );
    const allowanceSalary = payroll.salaries
      .filter((salary) => salary.type === SalaryType.ALLOWANCE)
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0);

    console.log("Tổng tiền phụ cấp ", allowanceSalary);
    console.log(
      "Tổng tiền đi làm thêm nhưng không phải ngày lễ x2 ",
      totalNotHoliday
    );

    console.log(
      "Tổng tiền: ",
      allowanceSalary + totalSalaryHoliday + totalNotHoliday + totalBasicSalary
    );
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
