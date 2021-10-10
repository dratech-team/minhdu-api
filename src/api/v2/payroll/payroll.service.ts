import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {DatetimeUnit, RecipeType, Role, Salary, SalaryType,} from "@prisma/client";
import {Response} from "express";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {lastDayOfMonth} from "../../../utils/datetime.util";
import {EmployeeService} from "../employee/employee.service";
import {HolidayService} from "../holiday/holiday.service";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {OnePayroll} from "./entities/payroll.entity";
import {PayrollRepository} from "./payroll.repository";
import {PAYSLIP_WORKDAY_HOLIDAY, RATE_OUT_OF_WORK_DAY, TAX,} from "../../../common/constant/salary.constant";
import {includesDatetime, isEqualDatetime,} from "../../../common/utils/isEqual-datetime.util";
import {ALL_DAY, PARTIAL_DAY,} from "../../../common/constant/datetime.constant";
import {exportExcel} from "../../../core/services/export.service";
import {FullSalary} from "../salary/entities/salary.entity";

@Injectable()
export class PayrollService {
  constructor(
    private readonly repository: PayrollRepository,
    private readonly employeeService: EmployeeService,
    private readonly holidayService: HolidayService
  ) {
  }

  async create(profile: ProfileEntity, body: CreatePayrollDto) {
    try {
      if (!body?.employeeId) {
        throw new BadRequestException("Tính năng đang được phát triển. Xin cảm ơn");
        /// FIXME: I need deep testing befrore release
        // const employee = await this.employeeService.findAll(
        //   profile,
        //   undefined,
        //   undefined
        // );
        //
        // const created = await Promise.all(employee.data.map(async employee => {
        //   return await this.repository.create({
        //     employeeId: employee.id,
        //     createdAt: body.createdAt,
        //   });
        // }));
        //
        // return {
        //   status: 201,
        //   message: `Đã tự động tạo phiếu lương tháng ${moment(body.createdAt).format("MM/YYYY")} cho ${created.length} nhân viên`,
        // };
      }
      return await this.repository.create(body);
    } catch (err) {
      console.error(err);
      throw new ConflictException(err);
    }
  }

  async findAll(user: ProfileEntity, skip: number, take: number, search?: Partial<SearchPayrollDto>) {
    return await this.repository.findAll(user, skip, take, search);
  }

  async confirmPayslip(id: number) {
    const payroll = await this.repository.findOne(id);
    return (await this.payslip(payroll)).payslip;
  }

  async payslip(payroll) {
    try {
      switch (payroll.employee.recipeType) {
        case RecipeType.CT1: {
          return Object.assign(payroll, {
            payslip: payroll.manConfirmedAt
              ? await this.totalSalaryCT1(payroll)
              : null,
          });
        }
        case RecipeType.CT2: {
          return Object.assign(payroll, {
            payslip: payroll.manConfirmedAt
              ? await this.totalSalaryCT2(payroll)
              : null,
          });
        }
        default:
          throw new BadRequestException(
            `Loại lương của nhân viên ${payroll.employee.lastName} không xác định thuộc công thức nào. Vui lòng liên hệ admin để kiểm tra`
          );
      }
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number): Promise<OnePayroll & { totalWorkday: number }> {
    const payroll = await this.repository.findOne(id);
    const absent = this.totalAbsent(payroll.salaries);
    const last = lastDayOfMonth(payroll.createdAt);
    return Object.assign(payroll, {totalWorkday: last - absent.day});

    // /// FIXME: Không nên get từ hàm này. sửa lại sau
    // const totalWorkday =
    //   payroll.employee.recipeType === RecipeType.CT1
    //     ? (await this.totalSalaryCT1(payroll)).totalWorkday
    //     : (await this.totalSalaryCT2(payroll)).totalWorkday;
    // return Object.assign(payroll, {totalWorkday});
  }

  async export(response: Response, user: ProfileEntity, filename: string) {
    const data = await this.findAll(user, undefined, undefined);
    // check Quản lý xác nhận tất cả phiếu lương mới được in
    const confirmed = data.data.filter((e) => e.manConfirmedAt === null).length;
    if (confirmed) {
      throw new BadRequestException(
        `Phiếu lương  chưa được xác nhận. Vui lòng đợi quản lý xác nhận tất cả trước khi in`
      );
    }

    const payrolls = await Promise.all(
      data.data.map(async (payroll) => {
        const name = payroll.employee.firstName + payroll.employee.lastName;
        const position = payroll.employee.position.name;
        const payslip = (await this.payslip(payroll)).payslip;

        return {
          name,
          position,
          basicSalary: Math.round(payslip.basic),
          standardSalary: Math.round(payslip.totalStandard),
          staySalary: Math.round(payslip.stay),
          workday: payslip.workday,
          workdayNotInHoliday: Math.round(payslip.workdayNotInHoliday),
          payslipInHoliday: Math.round(payslip.payslipInHoliday),
          payslipNotInHoliday: Math.round(payslip.payslipNotInHoliday),
          totalWorkday: payslip.totalWorkday,
          payslipWorkDayNotInHoliday: Math.round(
            payslip.payslipWorkDayNotInHoliday
          ),
          stay: Math.round(payslip.stay),
          payslipOutOfWorkday: Math.round(payslip.payslipOutOfWorkday),
          allowance: Math.round(payslip.allowance),
          tax: Math.round(payslip.tax),
          total: Math.round(payslip.total),
        };
      })
    );

    const customs = {
      name: "Họ và tên",
      position: "Chức vụ",
      basicSalary: "Lương cơ bản",
      standardSalary: "Tổng lương chuẩn",
      staySalary: "Tổng phụ cấp ở lại",
      workday: "Ngày công chuẩn",
      workdayNotInHoliday: "Ngày công thực tế trừ lễ",
      payslipInHoliday: "Lương ngày lễ",
      payslipNotInHoliday: "Lương trừ ngày lễ",
      totalWorkday: "Tổng ngày thực tế",
      payslipWorkDayNotInHoliday: "Tổng ngày trừ ngày lễ",
      stay: "Tổng lương phụ cấp",
      payslipOutOfWorkday: "Lương ngoài giờ x2",
      allowance: "Phụ câp",
      tax: "Thuế",
      total: "Tổng lương",
    };

    const customKeys = Object.keys(customs);
    const customHeaders = Object.values(customs);

    return exportExcel(
      response,
      {
        name: `data`,
        title: `Bảng lương tháng ${new Date().getMonth()} năm ${new Date().getFullYear()}`,
        customHeaders: customHeaders,
        customKeys: customKeys,
        data: payrolls,
      },
      200
    );
  }

  async timeKeeping() {
    throw new BadRequestException(
      "Tính năng sẽ được hoàn thành vào ngày 6/10/2021. Xin lỗi vì sự bất tiện"
    );
  }

  async findFirst(query: any) {
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
    // Chỉ xác nhận khi phiếu lương có tồn tại giá trị
    const payroll = await this.repository.findOne(id);
    if (!payroll.salaries.length) {
      throw new BadRequestException(`Không thể xác nhận phiếu lương rỗng`);
    } else {
      const salaries = payroll.salaries.filter(
        (salary) =>
          salary.type === SalaryType.BASIC_INSURANCE || SalaryType.BASIC
      );
      if (!salaries.length) {
        throw new BadRequestException(
          `Không thể xác nhận phiếu lương có lương cơ bản rỗng`
        );
      }
    }

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

    salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ABSENT ||
          salary.type === SalaryType.DAY_OFF
      )
      ?.forEach((salary) => {
        switch (salary.unit) {
          case DatetimeUnit.DAY: {
            if (salary.datetime) {
              day += salary.times;
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

  totalAllowanceByActual(salaries: Salary[], actualDay: number, workday?: number) {
    const allowanceFullActual = salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ALLOWANCE &&
          salary.unit === DatetimeUnit.DAY &&
          !salary.datetime
      )
      ?.map((salary) => salary.price)
      ?.reduce((a, b) => a + b, 0) * actualDay;

    const allowanceFromDate = salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ALLOWANCE &&
          salary.unit === DatetimeUnit.DAY &&
          salary.datetime
      )
      ?.map((salary) => {
        const day = actualDay - salary.datetime.getDate() || 0;
        return (salary.price / workday) * (day + 1);
      })
      ?.reduce((a, b) => a + b, 0);

    return allowanceFullActual + allowanceFromDate;
  }

  totalAllowanceDayRangeSalary(salaries: Salary[]) {
    return salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ALLOWANCE &&
          salary.unit === DatetimeUnit.DAY &&
          salary.datetime
      )
      ?.map((salary) => salary.price)
      ?.reduce((a, b) => a + b, 0);
  }

  totalAllowanceMonthSalary(salaries: Salary[]) {
    return salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ALLOWANCE &&
          salary.unit === DatetimeUnit.MONTH
      )
      ?.map((salary) => salary.price)
      ?.reduce((a, b) => a + b, 0);
  }

  totalStaySalary(salaries: Salary[]) {
    return salaries
      .filter((salary) => salary.type === SalaryType.STAY)
      ?.map((salary) => salary.price)
      ?.reduce((a, b) => a + b, 0);
  }

  totalBasicSalary(salaries: Salary[]) {
    return salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.BASIC ||
          salary.type === SalaryType.BASIC_INSURANCE
      )
      ?.map((salary) => salary.price)
      ?.reduce((a, b) => a + b, 0);
  }

  totalOvertime(salaries: FullSalary[]) {
    return salaries
      ?.filter((salary) => salary.type === SalaryType.OVERTIME)
      ?.map((salary) => salary.price * salary.times + (salary.allowance?.price * (salary.allowance?.times || 1) || 0))
      ?.reduce((a, b) => a + b, 0);
  }

  totalActualDay(payroll: OnePayroll) {
    // absent trừ cho ngày vào làm nếu ngày vào làm là tháng đc tính lương
    const absent = this.totalAbsent(payroll.salaries);

    /// FIXME: manConfirmedAt || accConfirmedAt || paidAt
    const confirmed = payroll.manConfirmedAt;

    const absentDay = absent.day + (isEqualDatetime(payroll.employee.createdAt, payroll.createdAt)
      ? payroll.employee.createdAt.getDate()
      : 0) + (isEqualDatetime(payroll.employee.leftAt, payroll.createdAt)
      ? payroll.employee.createdAt.getDate()
      : 0);

    // actual day
    return lastDayOfMonth(payroll.createdAt) - absentDay;
  }

  async generateHoliday(payrollId: number) {
    // throw new BadRequestException("Tính năng đang trong giai đoạn bảo trì. Thời gian hoàn thành dự kiến chưa xác định. Xin cảm ơn");
    let worksInHoliday = [];
    let worksNotInHoliday = [];

    const payroll = await this.findOne(payrollId);
    const currentHoliday = await this.holidayService.findCurrentHolidays(payroll.createdAt, payroll.employee.positionId);
    if (currentHoliday && currentHoliday.length) {
      for (let i = 0; i < currentHoliday.length; i++) {
        const salaries = payroll.salaries.filter(
          (salary) => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF
        );
        const isAbsentInHoliday = includesDatetime(
          salaries.map((salary) => salary.datetime),
          currentHoliday[i].datetime
        );
        if (isAbsentInHoliday) {
          const salary = salaries.find((salary) =>
            isEqualDatetime(salary.datetime, currentHoliday[i].datetime)
          );
          if (salary.times === 0.5) {
            /// Warning: update lại rate để tránh trùng với rate ngày nghỉ
            worksInHoliday.push(Object.assign(salary, {times: PARTIAL_DAY, rate: currentHoliday[i].rate}));
          }
        } else {
          worksInHoliday.push(Object.assign(currentHoliday[i], {times: ALL_DAY, title: currentHoliday[i].name}));
        }
      }
    }

    if (worksInHoliday?.length) {
      for (let i = 0; i < worksInHoliday.length; i++) {
        await this.repository.generate(payrollId, worksInHoliday[i]);
      }
    } else {
      await this.repository.generate(payrollId, null);
    }
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
   * - Công nhân trại chăn nuôi không có đi trễ
   * */

  /*
   *    basicSalary: Lương cơ bản trích bảo hiểm
   *   totalStandard: Tổng lương cơ bản chuẩn = Cụm lương cơ bản + phụ cấp ở lại
   *   workday: Ngày làm việc chuẩn
   *   workdayNotInHoliday: Ngày làm việc trừ ngày lễ`
   *   worksInHoliday: Ngày làm việc thuộc ngày lễ
   *   worksNotInHoliday: Ngày lễ nhưng không đi làm. sẽ được tính theo lương cơ bản. Không rate
   *   totalWorkday; Tổng ngày làm việc theo ngày công chuẩn
   *  payslipNormalDay: Tổng tiền theo ngày làm việc bình thường
   *  payslipInHoliday:  Tổng tiền theo ngày làm việc trong ngày lễ (đã rate)
   *  payslipNotInHoliday: Tổng tiền c trong ngày lễ nhưng không đi làm (tính theo lương cơ bản)
   *  staySalary: Tổng phụ cấp ở lại
   * payslipOutOfWorkday: Tổng tiền ngoài giờ làm việc chính thức. ngày đi làm thực tế > ngày đi làm công chuẩn => Những ngày còn lại sẽ được RATE_OUT_OF_WORK_DAY (x2) tùy theo quy định.
   */
  async totalSalaryCT1(payroll: OnePayroll) {
    let payslipInHoliday = 0;
    let payslipNotInHoliday = 0;

    // datetime
    const currentHoliday = await this.holidayService.findCurrentHolidays(payroll.createdAt, payroll.employee.positionId);
    const workday = payroll.employee.workday;
    // absent trừ cho ngày vào làm nếu ngày vào làm là tháng đc tính lương
    const absent = this.totalAbsent(payroll.salaries);

    const absentDay = absent.day + (isEqualDatetime(payroll.employee.createdAt, payroll.createdAt)
      ? payroll.employee.createdAt.getDate()
      : 0) + (isEqualDatetime(payroll.employee.leftAt, payroll.createdAt)
      ? payroll.employee.createdAt.getDate()
      : 0);

    // day
    const actualDay = this.totalActualDay(payroll);
    const absents = payroll.salaries.filter(
      (salary) => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF
    );

    // salary
    /// FIXME" Chuyen sang ham total salary basic
    const basicSalary = this.totalBasicSalary(payroll.salaries);

    // salary
    const basic = payroll.salaries.find(
      (salary: Salary) => salary.type === SalaryType.BASIC_INSURANCE
    )?.price;

    const basicDaySalary = basicSalary / payroll.employee.workday;
    const staySalary =
      actualDay >= workday
        ? this.totalStaySalary(payroll.salaries)
        : (this.totalStaySalary(payroll.salaries) / workday) * actualDay;

    // datetime
    const worksInHoliday = [];
    const worksNotInHoliday = [];
    // Get ngày Không đi làm trong ngày lễ để hiển thị ra UI
    currentHoliday.forEach(holiday => {
      const absentsDate = absents.map(absent => absent.datetime);
      if (includesDatetime(absentsDate, holiday.datetime)) {
        if (absents.find(absent => isEqualDatetime(absent.datetime, holiday.datetime)).times === PARTIAL_DAY) {
          if (!holiday.isConstraint || (holiday.isConstraint && actualDay > workday)) {
            worksInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime, rate: holiday.rate});
          }
        } else {
          worksNotInHoliday.push({day: ALL_DAY, datetime: holiday.datetime, rate: holiday.rate});
        }
      } else {
        if (!holiday.isConstraint || (holiday.isConstraint && actualDay > workday)) {
          // case: Đi làm lễ nguyên ngày nhưng trong tháng dó ngày công thực tế chỉ dư ra 0.5 ngày so với ngày công chuẩn.
          /// FIXME: Còn thiếu case Nếu dư ra 1 ngày hoặc 0.5 ngày nhưng tháng đó đi làm cả 2 ngày lễ và 2 ngày lễ có rate khác nhau là x2, x3 thì sẽ áp dụng cho lễ nào

          // tổng ngày lễ đã được thêm vào
          const day = worksInHoliday.map(w => w?.day || 0).reduce((a, b) => a + b, 0);
          worksInHoliday.push({
            day: actualDay - workday - day === 0.5 ? PARTIAL_DAY : ALL_DAY,
            datetime: holiday.datetime,
            rate: holiday.rate
          });
        }
      }
    });

    // Ngày công đi làm  trong ngày lễ
    const workdayInHoliday = worksInHoliday.map((date) => date.day).reduce((a, b) => a + b, 0);
    const workdayNotInHoliday = lastDayOfMonth(payroll.createdAt) - workdayInHoliday - absentDay;

    // Quét qua số ngày đi làm thực tế để kiểm tra đkien đủ hoặc đi làm dư ngày so với ngày thực tế mới thỏa mãn nhận lương nhân hệ số.
    /// FIXME: issue 293
    // const actualDayInHoliday = worksInHoliday.map(w => w.day).reduce((a, b) => a + b, 0) - (actualDay - workday);
    //
    // console.log(actualDayInHoliday)

    payslipInHoliday = worksInHoliday.map(w => {
      return basicDaySalary * w.rate * w.day;
    }).reduce((a, b) => a + b, 0);


    // Đi làm nhưng không thuộc ngày lễ x2
    const payslipOutOfWorkday = workdayNotInHoliday - workday > 0
      ? (workdayNotInHoliday - workday) * basicDaySalary * RATE_OUT_OF_WORK_DAY
      : 0;


    const allowanceDayByActual = this.totalAllowanceByActual(payroll.salaries, actualDay, workday);

    /// FIXME: Phụ cấp từ ngày đến ngày. Chưa cần dùng tới
    const allowanceDayRangeSalary = this.totalAllowanceDayRangeSalary(
      payroll.salaries
    );
    const allowanceMonthSalary = this.totalAllowanceMonthSalary(
      payroll.salaries
    );
    const allowanceTotal = allowanceMonthSalary + allowanceDayByActual;

    // overtime
    const overtime = this.totalOvertime(payroll.salaries);

    // logic hiện tại. Nếu tháng đó có 1 ngày k ràng buộc bởi ngày công chuẩn. thì nguyên tháng sẽ đc k ràng buộc
    const isConstraint = currentHoliday.some(holiday => {
      return holiday.isConstraint;
    });

    const payslipNormalDay = !isConstraint
      ? basicDaySalary * (workdayNotInHoliday >= workday ? workday : workdayNotInHoliday)
      : basicDaySalary * (actualDay > workday ? workday : actualDay);

    const totalStandard = basicSalary + staySalary;
    const tax = payroll.employee.contracts?.length ? basic * TAX : 0;
    const total = Math.round((payslipNormalDay + payslipInHoliday + payslipNotInHoliday + payslipOutOfWorkday + staySalary + allowanceTotal + overtime - tax) / 1000) * 1000;

    /// FIXME: TESTING. DON'T DELETE IT
    // console.log("Lương cơ bản", basicSalary);
    // console.log("Ngày công chuẩn", workday);
    // console.log("Ngày công trừ ngày lễ / tết", workdayNotInHoliday);
    // console.log("Tổng ngày công thực nhận", totalWorkday);
    // console.log("Tổng lương đi làm ngày lễ", payslipInHoliday);
    // console.log("Tổng lương không đi làm ngày lễ ", payslipNotInHoliday);
    // console.log("Tổng lương đi làm ngoài ngày lễ( x2 )", payslipOutOfWorkday);
    // console.log("Tổng lương ngày đi làm thực tế trừ lễ: ", payslipNormalDay);
    // console.log("Tổng phụ cấp", staySalary);
    //
    // console.log("=====================================================");
    //
    // console.log("Tổng lương ngày đi làm thực tế trừ lễ", payslipNormalDay);
    // console.log("Tổng lương đi làm ngày lễ", payslipInHoliday);
    // console.log("Lương 1 ngày công", basicDaySalary);
    // console.log("Tổng phụ cấp", staySalary);
    // console.log("Thuees", tax);
    // console.log("Tổng tiền tăng ca", overtime);

    return {
      basic: basicSalary,
      workday,
      workdayNotInHoliday,
      worksInHoliday,
      worksNotInHoliday,
      totalWorkday: actualDay,
      payslipNormalDay,
      payslipInHoliday,
      payslipNotInHoliday,
      payslipWorkDayNotInHoliday: basicDaySalary * workdayNotInHoliday,
      stay: staySalary,
      overtime: overtime,
      totalStandard,
      payslipOutOfWorkday,
      allowance: allowanceTotal,
      tax,
      total
    };
  }

  /**
   *CT2:
   * 1. actual >= workday                  => result = (basics / workday) x workday + stays + allowances
   * 2. actual < workday                  => result = [(basics + stays) / workday] x actual + allowances
   * 3. isFlat === true && absents !== 0  => actual = workday (Dù tháng đó có bao nhiêu ngày đi chăng nữa). else quay lại 1 & 2
   */
  // CT2
  async totalSalaryCT2(payroll: OnePayroll) {
    let tax = 0;
    let basicDaySalary = 0;
    let payslipInHoliday = 0;
    let payslipNotInHoliday = 0;

    //datetime
    const currentHoliday = await this.holidayService.findCurrentHolidays(payroll.createdAt, payroll.employee.positionId);

    let actualDay = this.totalActualDay(payroll);
    if (
      payroll.employee.isFlatSalary &&
      this.totalAbsent(payroll.salaries).day === 0 &&
      !payroll.isEdit
    ) {
      actualDay = 30;
    }

    // basic
    const basicSalary = this.totalBasicSalary(payroll.salaries);
    const staySalary = this.totalStaySalary(payroll.salaries);

    // Phụ cấp theo tháng
    const allowanceMonthSalary = this.totalAllowanceMonthSalary(payroll.salaries);
    /// FIXME: Phụ cấp từ ngày đến ngày. Chưa cần dùng tới
    const allowanceDayRangeSalary = this.totalAllowanceDayRangeSalary(payroll.salaries);
    const allowanceDayByActual = this.totalAllowanceByActual(payroll.salaries, actualDay, payroll.employee.workday);

    if (actualDay >= payroll.employee.workday) {
      basicDaySalary = basicSalary / payroll.employee.workday;
    } else {
      basicDaySalary = (basicSalary + staySalary) / payroll.employee.workday;
    }

    const basic = payroll.salaries.find(
      (salary) => salary.type === SalaryType.BASIC_INSURANCE
    );

    // Thuế dựa theo lương cơ bản BASIC_INSURANCE
    if (basic) {
      tax = payroll.employee.contracts.length !== 0 ? basic.price * TAX : 0;
    }

    const allowanceTotal = allowanceMonthSalary + allowanceDayByActual;

    if (currentHoliday && currentHoliday.length) {
      for (let i = 0; i < currentHoliday.length; i++) {
        const salaries = payroll.salaries.filter(salary => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF);
        const isAbsentInHoliday = includesDatetime(salaries.map(salary => salary.datetime), currentHoliday[i].datetime);
        if (isAbsentInHoliday) {
          const salary = salaries.find(salary => isEqualDatetime(salary.datetime, currentHoliday[i].datetime));
          if (salary.times === 0.5) {
            /// FIXME: confirm lại nếu đi làm ngày lễ nhưng đkien ngày thực tế > ngày công chuẩn mới được hưởng thưởng hay k cần điều kiện. Nếu không cần thì bỏ đkien đi
            // Đi làm nửa ngày thì dược hưởng nửa thưởng
            // if (actualDay >= payroll.employee.workday) {
            payslipInHoliday += currentHoliday[i].price / 2;
            // }
          } else if (salary.times === 1) {
            // Vắng trong ngày lễ thì k đc tiền.
          } else {
            throw new BadRequestException(
              `${payroll.employee.lastName} ngày ${payroll.createdAt} có thời gian làm ngày lễ không hợp lệ`
            );
          }
        } else {
          /// FIXME: confirm lại nếu đi làm ngày lễ nhưng đkien ngày thực tế > ngày công chuẩn mới được hưởng thưởng hay k cần điều kiện. Nếu không cần thì bỏ đkien đi
          // if (actualDay >= payroll.employee.workday) {
          payslipInHoliday += currentHoliday[i].price;
          // }
        }
      }
    }

    const overtimeSalary = this.totalOvertime(payroll.salaries);
    const absent = this.totalAbsent(payroll.salaries);

    const absentDay = absent.day + (isEqualDatetime(payroll.employee.createdAt, payroll.createdAt)
      ? payroll.employee.createdAt.getDate()
      : 0) + (isEqualDatetime(payroll.employee.leftAt, payroll.createdAt)
      ? payroll.employee.createdAt.getDate()
      : 0);

    // day
    const workdayNotInHoliday = lastDayOfMonth(payroll.createdAt) - currentHoliday.length - absentDay;
    const absents = payroll.salaries.filter(
      (salary) => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF
    );

    // datetime
    const worksInHoliday = [];
    const worksNotInHoliday = [];
    // Get ngày Không đi làm trong ngày lễ để hiển thị ra UI
    currentHoliday.forEach(holiday => {
      const absentsDate = absents.map(absent => absent.datetime);
      if (includesDatetime(absentsDate, holiday.datetime)) {
        if (absents.find(absent => isEqualDatetime(absent.datetime, holiday.datetime)).times === PARTIAL_DAY) {
          worksInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime});
          worksNotInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime});
        } else {
          worksNotInHoliday.push({day: ALL_DAY, datetime: holiday.datetime});
        }
      } else {
        worksInHoliday.push({day: ALL_DAY, datetime: holiday.datetime});
      }
    });

    // Ngày lễ không được tính vào ngày vắng
    /// FIXME: Có thể xóa nếu k phát sinh lỗi
    const absentDaySalary = (actualDay + worksNotInHoliday.map(w => w.day).reduce((a, b) => a + b, 0)) < payroll.employee.workday ? this.totalAbsent(payroll.salaries).day * basicDaySalary : 0;
    const absentHourSalary = this.totalAbsent(payroll.salaries).hour * (basicDaySalary / 8);
    const absentHourMinuteSalary = this.totalAbsent(payroll.salaries).minute * (basicDaySalary / 8 / 60);

    // Tổng tiền đi trễ. Ngày nghỉ là ngày đã đc trừ trên ngày đi làm thực tế, nên sẽ không tính vào tiền khấu trừ
    const deductionSalary = absentHourSalary + absentHourMinuteSalary;

    // Không quan tâm đến ngày công thực tế hay ngày công chuẩn. Nếu không đi làm trong ngày lễ thì vẫn được hưởng lương như thường
    payslipNotInHoliday = worksNotInHoliday.map(w => w.day).reduce((a, b) => a + b, 0) * (basic.price / PAYSLIP_WORKDAY_HOLIDAY);

    /// FIXME: TESTING. DON'T DELETE IT
    // console.log("Lương cơ bản", basicSalary);
    // console.log("Ngày công chuẩn", payroll.employee.workday);
    // console.log("Ngày công thực tế trừ ngày lễ", workdayNotInHoliday);
    // // console.log("Tổng ngày công thực nhận lương", totalWorkday);
    // console.log("Tổng lương đi làm ngày lễ", payslipInHoliday);
    // console.log("Lương không đi làm ngày lễ", payslipNotInHoliday);
    // console.log("Tổng phụ cấp", staySalary);
    // console.log("Tổng tiền khấu trừ", absentDaySalary);
    //
    // console.log("=====================================================");
    //
    // console.log("Tổng lương đi làm ngày lễ", payslipInHoliday);
    // console.log("Tổng phụ cấp", staySalary);
    // console.log("Thuees", tax);
    // console.log("Tổng tiền tăng ca", overtimeSalary);
    // console.log("total", total);

    let total: number;
    if (actualDay >= payroll.employee.workday) {
      total = basicDaySalary * actualDay + Math.ceil(allowanceTotal) + staySalary + payslipInHoliday + payslipNotInHoliday + overtimeSalary - deductionSalary - tax;
    } else {
      total = basicDaySalary * actualDay + Math.ceil(allowanceTotal) + payslipInHoliday + payslipNotInHoliday + workdayNotInHoliday + overtimeSalary - deductionSalary - tax;
    }

    return {
      basic: Math.ceil(basicSalary),
      stay: Math.ceil(staySalary),
      overtime: overtimeSalary,
      allowance: allowanceTotal,
      payslipInHoliday,
      payslipNotInHoliday,
      workdayNotInHoliday,
      worksInHoliday,
      worksNotInHoliday,
      deduction: deductionSalary,
      daySalary: basicDaySalary,
      totalWorkday: actualDay,
      workday: payroll.employee.workday,
      payslipNormalDay: Math.ceil(basicDaySalary * actualDay),
      tax: tax,
      total: Math.round(total / 1000) * 1000,
    };
  }
}
