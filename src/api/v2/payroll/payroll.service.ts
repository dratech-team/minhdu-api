import {BadRequestException, ConflictException, Injectable,} from "@nestjs/common";
import {DatetimeUnit, Payroll, RecipeType, Role, Salary, SalaryType,} from "@prisma/client";
import {Response} from "express";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {lastDatetimeOfMonth} from "../../../utils/datetime.util";
import {EmployeeService} from "../employee/employee.service";
import {HolidayService} from "../holiday/holiday.service";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {OnePayroll} from "./entities/payroll.entity";
import {PayrollRepository} from "./payroll.repository";
import {RATE_OUT_OF_WORK_DAY, TAX,} from "../../../common/constant/salary.constant";
import {PayslipEntity} from "./entities/payslip.entity";
import {includesDatetime, isEqualDatetime,} from "../../../common/utils/isEqual-datetime.util";
import {ALL_DAY, PARTIAL_DAY,} from "../../../common/constant/datetime.constant";
import {exportExcel} from "../../../core/services/export.service";

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
    const res = await this.repository.findAll(user, skip, take, search);
    const payroll = await Promise.all(
      res.data.map(async (payroll) => await this.payslip(payroll))
    );
    return {total: res.total, data: payroll};
  }

  async generate(profile: ProfileEntity, datetime: Date) {
    let count = 0;
    const employee = await this.employeeService.findAll(
      profile,
      undefined,
      undefined
    );

    ///
    for (let i = 0; i < employee.data.length; i++) {
      const payroll = await this.repository.findByEmployeeId(
        employee.data[i].id
      );

      if (!payroll) {
        await this.repository.create({
          employeeId: employee.data[i].id,
          createdAt: datetime || new Date(),
        });
        count++;
      }
    }
    return {
      statusCode: 201,
      message: `${count} Phiếu lương trong tháng ${new Date().getMonth()} đã được tạo`,
    };
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
              ? this.totalSalaryCT2(payroll)
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
    if (!payroll) {
      throw new BadRequestException(`${id} không tồn tại..`);
    }
    /// FIXME: Không nên get từ hàm này. sửa lại sau
    const totalWorkday =
      payroll.employee.recipeType === RecipeType.CT1
        ? (await this.totalSalaryCT1(payroll)).totalWorkday
        : (await this.totalSalaryCT2(payroll)).totalWorkday;
    return Object.assign(payroll, {totalWorkday});
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
    const DAY = 1;

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
    return (
      salaries
        .filter(
          (salary) =>
            salary.type === SalaryType.ALLOWANCE &&
            salary.unit === DatetimeUnit.DAY &&
            !salary.datetime
        )
        ?.map((salary) => salary.price)
        ?.reduce((a, b) => a + b, 0) * actualDay
    );
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

  async generateHoliday(payrollId: number) {
    let worksInHoliday = [];
    let worksNotInHoliday = [];

    const payroll = await this.findOne(payrollId);
    const currentHoliday = await this.holidayService.findCurrentHolidays(payroll.createdAt, payroll.employee.positionId);

    if (currentHoliday && currentHoliday.length) {
      for (let i = 0; i < currentHoliday.length; i++) {
        const salary = {
          title: currentHoliday[i].name,
          price: currentHoliday[i]?.price,
          type: SalaryType.HOLIDAY,
          datetime: currentHoliday[i].datetime,
          rate: currentHoliday[i].rate,
        };
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

          if (salary.times === 1) {
            worksNotInHoliday.push(Object.assign(salary, {times: ALL_DAY}));
          } else if (salary.times === 0.5) {
            worksNotInHoliday.push(
              Object.assign(salary, {times: PARTIAL_DAY})
            );
            worksInHoliday.push(Object.assign(salary, {times: PARTIAL_DAY}));
          } else {
            throw new BadRequestException(
              `${payroll.employee.lastName} ngày ${payroll.createdAt} có thời gian làm ngày lễ không hợp lệ`
            );
          }
        } else {
          worksInHoliday.push(Object.assign(salary, {times: ALL_DAY}));
        }
      }
    }
    for (let i = 0; i < worksInHoliday.length; i++) {
      await this.repository.generate(payrollId, worksInHoliday[i]);
    }
    return {worksInHoliday, worksNotInHoliday};
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
  async totalSalaryCT1(payroll: OnePayroll) {
    let payslipInHoliday = 0;
    let payslipNotInHoliday = 0;

    // datetime
    const currentHoliday = await this.holidayService.findCurrentHolidays(payroll.createdAt, payroll.employee.positionId);
    const workday = payroll.employee.workday;
    // absent trừ cho ngày vào làm nếu ngày vào làm là tháng đc tính lương
    const absent = this.totalAbsent(payroll.salaries);

    const absentDay =
      absent.day +
      (isEqualDatetime(payroll.employee.createdAt, payroll.createdAt)
        ? payroll.employee.createdAt.getDate()
        : 0) +
      (isEqualDatetime(payroll.employee.leftAt, payroll.createdAt)
        ? payroll.employee.createdAt.getDate()
        : 0);

    // day
    const workdayNotInHoliday =
      lastDatetimeOfMonth(payroll.createdAt).getDate() -
      currentHoliday.length -
      absentDay;
    const actualDay = lastDatetimeOfMonth(new Date()).getDate() - absentDay;
    const absents = payroll.salaries.filter(
      (salary) =>
        salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF
    );

    // salary
    const basicSalary = payroll.salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.BASIC ||
          salary.type === SalaryType.BASIC_INSURANCE
      )
      .map((salary) => salary.price)
      .reduce((a, b) => a + b, 0);

    // salary
    const basic = payroll.salaries.find(
      (salary: Salary) => salary.type === SalaryType.BASIC_INSURANCE
    )?.price;

    const basicDaySalary = basicSalary / payroll.employee.workday;
    const staySalary =
      actualDay >= workday
        ? this.totalStaySalary(payroll.salaries)
        : (this.totalStaySalary(payroll.salaries) / workday) * actualDay;

    // Tính tiền đi làm trong nggày lễ cho 1 ngày và nửa ngàu thường
    if (currentHoliday && currentHoliday.length) {
      for (let i = 0; i < currentHoliday.length; i++) {
        const salaries = payroll.salaries.filter(
          (salary) =>
            salary.type === SalaryType.ABSENT ||
            salary.type === SalaryType.DAY_OFF
        );
        const isAbsentInHoliday = includesDatetime(
          salaries.map((salary) => salary.datetime),
          currentHoliday[i].datetime
        );
        if (isAbsentInHoliday) {
          const salary = salaries.find((salary) =>
            isEqualDatetime(salary.datetime, currentHoliday[i].datetime)
          );
          if (salary.times === 1) {
            // không đi làm sẽ được tính theo lương cơ bản bth
            payslipNotInHoliday += basicDaySalary;
          } else if (salary.times === 0.5) {
            // nửa ngày lễ nghỉ tính giá thường k nhân
            payslipNotInHoliday += basicDaySalary / 2;
            // nửa ngày lễ đi làm  tính giá nửa ngày nhân hệ số
            // nếu nó là ngày tết isConstraint = false. k bị ràng buộc bởi ngày làm thực tế thì vẫn sẽ được nhân hệ số dù có di làm đủ ngày công hay k đi chăng nữa.
            // ngược lại nhân hay k sẽ bị phụ thuộc vào ngày công so với ngày công chuẩn
            if (
              !currentHoliday[i].isConstraint ||
              (currentHoliday[i].isConstraint && actualDay >= workday)
            ) {
              payslipInHoliday += (basicDaySalary / 2) * currentHoliday[i].rate;
            } else {
              payslipInHoliday += basicDaySalary / 2;
            }
          } else {
            throw new BadRequestException(
              `${payroll.employee.lastName} ngày ${payroll.createdAt} có thời gian làm ngày lễ không hợp lệ`
            );
          }
        } else {
          if (
            !currentHoliday[i].isConstraint ||
            (currentHoliday[i].isConstraint && actualDay >= workday)
          ) {
            payslipInHoliday += basicDaySalary * currentHoliday[i].rate;
          } else {
            payslipInHoliday += basicDaySalary;
          }
        }
      }
    }

    // Đi làm nhưng không thuộc ngày lễ x2
    const payslipOutOfWorkday =
      actualDay - (currentHoliday.length + workday) > 0
        ? (actualDay - (currentHoliday.length + workday)) *
        basicDaySalary *
        RATE_OUT_OF_WORK_DAY
        : 0;

    // datetime
    const worksInHoliday = [];
    const worksNotInHoliday = [];
    // Get ngày Không đi làm trong ngày lễ để hiển thị ra UI
    currentHoliday.forEach((holiday) => {
      const absentsDate = absents.map((absent) => absent.datetime);
      if (includesDatetime(absentsDate, holiday.datetime)) {
        if (
          absents.find((absent) =>
            isEqualDatetime(absent.datetime, holiday.datetime)
          ).times === PARTIAL_DAY
        ) {
          worksInHoliday.push({
            day: PARTIAL_DAY,
            datetime: holiday.datetime,
            rate: holiday.rate,
          });
          worksNotInHoliday.push({
            day: PARTIAL_DAY,
            datetime: holiday.datetime,
            rate: holiday.rate,
          });
        } else {
          worksNotInHoliday.push({
            day: ALL_DAY,
            datetime: holiday.datetime,
            rate: holiday.rate,
          });
        }
      } else {
        worksInHoliday.push({
          day: ALL_DAY,
          datetime: holiday.datetime,
          rate: holiday.rate,
        });
      }
    });

    // Ngày công đi làm không fai ngày lễ và ngày đi làm trong ngày lễ cộng với nhau
    const totalWorkday =
      workdayNotInHoliday +
      worksInHoliday.map((date) => date.day).reduce((a, b) => a + b, 0);

    const allowanceDayByActual = this.totalAllowanceByActual(
      payroll.salaries,
      actualDay
    );
    const allowanceDayRangeSalary = this.totalAllowanceDayRangeSalary(
      payroll.salaries
    );
    const allowanceMonthSalary = this.totalAllowanceMonthSalary(
      payroll.salaries
    );
    const allowanceTotal =
      allowanceMonthSalary + allowanceDayByActual + allowanceDayRangeSalary;

    // overtime
    /// FIXME: Neen tach ham
    const overtime = payroll.salaries
      ?.filter(
        (salary) =>
          salary.type === SalaryType.OVERTIME &&
          salary.unit === DatetimeUnit.HOUR
      )
      ?.map((salary) => salary.price * salary.times + salary.allowance?.price)
      ?.reduce((a, b) => a + b, 0);

    const payslipNormalDay =
      basicDaySalary * (actualDay > workday ? workday : actualDay);
    const totalStandard = basicSalary + staySalary;
    const tax = payroll.employee.contracts?.length ? basic * TAX : 0;

    /// FIXME: TESTING. DON'T DELETE IT
    // console.log("Lương cơ bản", basicSalary);
    // console.log("Ngày công chuẩn", workday);
    // console.log("Ngày công thực tế trừ ngày lễ", workdayNotInHoliday);
    // console.log("Tổng ngày công thực nhận lương", totalWorkday);
    // console.log("Tổng lương đi làm ngày lễ", payslipInHoliday);
    // console.log("Tổng lương không đi làm ngày lễ ", payslipNotInHoliday);
    // console.log("Tổng lương đi làm ngoài ngày lễ ", payslipOutOfWorkday);
    // console.log("Tổng phụ cấp", staySalary);

    // console.log("=====================================================");

    // console.log("Lương ngày công thực tế trừu ngày lễ", payslipNormalDay);
    // console.log("Tổng lương đi làm ngày lễ", payslipInHoliday);
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
      total:
        Math.round(
          (payslipNormalDay +
            payslipInHoliday +
            payslipNotInHoliday +
            payslipOutOfWorkday +
            staySalary +
            allowanceTotal +
            overtime -
            tax) /
          1000
        ) * 1000,
    };
  }

  /**
   *CT2:
   * 1. actual >= workday                  => result = (basics / workday) x workday + stays + allowances
   * 2. actual < workday                  => result = [(basics + stays) / workday] x actual + allowances
   * 3. isFlat === true && absents !== 0  => actual = workday (Dù tháng đó có bao nhiêu ngày đi chăng nữa). else quay lại 1 & 2
   */
  // CT2
  async totalSalaryCT2(payroll: OnePayroll): Promise<Partial<PayslipEntity>> {
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
    const basicSalary = this.totalBasicSalary(payroll.salaries);

    // Lương ở lại
    const staySalary = this.totalStaySalary(payroll.salaries);

    // Phụ cấp theo tháng
    const allowanceMonthSalary = this.totalAllowanceMonthSalary(
      payroll.salaries
    );

    // Phụ cấp theo ngày, sẽ có unit là day và không có datetime (dựa vào ngày đi làm thực tế)
    const allowanceDayRangeSalary = this.totalAllowanceDayRangeSalary(
      payroll.salaries
    );

    const allowanceDayByActual = this.totalAllowanceByActual(
      payroll.salaries,
      actualDay
    );

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
      daySalary: daySalary,
      totalWorkday: actualDay,
      workday: payroll.employee.workday,
      payslipNormalDay: Math.ceil(daySalary * actualDay),
      tax: tax,
      total: Math.round(total / 1000) * 1000,
    };
  }
}
