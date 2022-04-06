import {BadRequestException, ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {DatetimeUnit, EmployeeType, Payroll, RecipeType, RoleEnum, Salary, SalaryType,} from "@prisma/client";
import {Response} from "express";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {firstDatetime, lastDatetime, lastDayOfMonth} from "../../../utils/datetime.util";
import {EmployeeService} from "../employee/employee.service";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {OnePayroll} from "./entities/payroll.entity";
import {PayrollRepository} from "./payroll.repository";
import {PAYSLIP_WORKDAY_HOLIDAY, RATE_OUT_OF_WORK_DAY,} from "../../../common/constant/salary.constant";
import {includesDatetime, isEqualDatetime,} from "../../../common/utils/isEqual-datetime.util";
import {ALL_DAY, PARTIAL_DAY,} from "../../../common/constant/datetime.constant";
import {exportExcel} from "../../../core/services/export.service";
import {FullSalary} from "../salary/entities/salary.entity";
import * as moment from "moment";
import {ConfirmPayrollDto} from "./dto/confirm-payroll.dto";
import {rageDateTime, timesheet} from "./functions/timesheet";
import {FilterTypeEnum} from "./entities/filter-type.enum";
import {ItemExportDto} from "../../../common/interfaces/items-export.dto";
import {SearchExportDto} from "./dto/search-export.dto";
import {convertArrayToString} from "./functions/convertArrayToString";
import {SearchSalaryDto} from "./dto/search-salary.dto";
import *as _ from "lodash";

@Injectable()
export class PayrollService {
  constructor(
    private readonly repository: PayrollRepository,
    private readonly employeeService: EmployeeService,
  ) {
  }

  async create(profile: ProfileEntity, body: CreatePayrollDto) {
    try {
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
            }
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
          message: `Đã tự động tạo phiếu lương tháng ${moment(body.createdAt).format("MM/YYYY")} cho ${createds.length} nhân viên`,
        };
      } else {
        // Tạo 1
        const employee = await this.employeeService.findOne(body.employeeId);
        if (moment(employee.createdAt).isAfter(body.createdAt)) {
          throw new BadRequestException(`Không được tạo phiếu lương trước ngày nhân viên vào làm. Xin cảm ơn`);
        }
        return await this.repository.create(Object.assign(body, {
          employeeId: employee.id,
          branch: employee.branch,
          position: employee.position,
          recipeType: employee.recipeType,
          workday: employee.workday,
          isFlatSalary: employee.isFlatSalary,
        }), true);
      }

    } catch (err) {
      console.error(err);
      throw new ConflictException(err);
    }
  }

  async findAll(profile: ProfileEntity, search?: Partial<SearchPayrollDto>) {
    const {total, data} = await this.repository.findAll(profile, search);
    switch (search.filterType) {
      case FilterTypeEnum.TIME_SHEET: {
        return {
          total,
          data: data.map(payroll => {
            return Object.assign(payroll, {timesheet: timesheet(payroll)});
          })
        };
      }
      case FilterTypeEnum.PAYROLL: {
        return {
          total,
          data: await Promise.all(data.map(async payroll => {
            return await this.mapPayslip(payroll);
          }))
        };
      }
      case FilterTypeEnum.SEASONAL: {
        return {
          total,
          data: data.map(payroll => {
            return Object.assign(payroll, {payslip: payroll.accConfirmedAt ? this.totalSalaryCT3(payroll) : null});
          }),
        };
      }
      case FilterTypeEnum.OVERTIME: {
        return this.filterOvertime(profile, search);
      }
      case FilterTypeEnum.BASIC:
      case FilterTypeEnum.ABSENT:
      case FilterTypeEnum.ALLOWANCE:
      case FilterTypeEnum.STAY: {
        return await this.repository.findSalaries(profile, search);
      }
      default: {
        return {total, data};
      }
    }
  }

  async findOne(id: number): Promise<OnePayroll & { totalWorkday: number }> {
    const payroll = await this.repository.findOne(id);
    return Object.assign(payroll, {totalWorkday: this.totalActualDay(payroll)});
  }

  async update(profile: ProfileEntity, id: number, updates: UpdatePayrollDto) {
    return await this.repository.update(profile, id, updates);
  }

  async confirmPayroll(profile: ProfileEntity, id: number, body: ConfirmPayrollDto) {
    let updated: Payroll;

    const payroll = await this.findOne(id);
    if (profile.role === RoleEnum.CAMP_MANAGER && !payroll.accConfirmedAt) {
      throw new BadRequestException(`Kế toán cần xác nhận phiếu lương trước!!!`);
    }
    if (!payroll.salaries.filter(salary => salary.type === SalaryType.BASIC_INSURANCE).length && payroll.employee.type !== EmployeeType.SEASONAL) {
      throw new BadRequestException(`Phiếu lương thiếu lương cơ bản trích BH. Cần thêm mục này để tạm tính lương`);
    }
    if (!payroll.employee.createdAt) {
      throw new BadRequestException(`Vui lòng thêm ngày vào làm / ngày thử việc của nhân viên để đảm bảo phiếu lương hoạt động đúng..`);
    }

    if (payroll.accConfirmedAt && !payroll.isEdit) {
      throw new BadRequestException(`Phiếu lương đã được xác nhận. Bạn không được phép sửa!!`);
    }

    const payslip = (await this.mapPayslip(payroll)).payslip;

    switch (profile.role) {
      case RoleEnum.CAMP_ACCOUNTING:
      case RoleEnum.HUMAN_RESOURCE: {
        if (!payroll.accConfirmedAt && payroll.isEdit) {
          await this.update(profile, id, {total: payslip?.total, actualday: payslip?.totalWorkday});
        }
        updated = await this.repository.update(profile, id, payroll.accConfirmedAt ? {
          isEdit: false,
          total: payslip.total,
        } : {accConfirmedAt: body.datetime});
        break;
      }
      case RoleEnum.CAMP_MANAGER:
        updated = await this.repository.update(profile, id, {manConfirmedAt: body.datetime});
        break;
      default:
        throw new BadRequestException(
          `${profile.role} Bạn không có quyền xác nhận phiếu lương. Cảm ơn.`
        );
    }
    if (updated) {
      await this.generateHoliday(id, false);
    }

    return Object.assign(updated, {totalWorkday: this.totalActualDay(updated as OnePayroll)});
  }

  // isCancel: Hủy xác nhận tính lương.
  // !isCancel khôi phục phiếu lương đã xác nhận
  async restorePayslip(profile: ProfileEntity, id: number, isCancel?: boolean) {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException(`Không tìm thấy id ${id}`);
    }

    if (!found.accConfirmedAt) {
      throw new BadRequestException("Phiếu lương chưa xác nhận. Không thể khôi phục. Xin cảm ơn...");
    }

    if (found.manConfirmedAt) {
      throw new BadRequestException("Phiếu lương đã được quản lý xác nhận. Không thể khôi phục. Xin cảm ơn...");
    }

    if (found.paidAt) {
      throw new BadRequestException("Phiếu lương đã được thanh toán. Không thể khôi phục. Xin cảm ơn...");
    }
    const restored = isCancel
      ? await this.update(profile, id, {accConfirmedAt: null})
      : await this.update(profile, id, {
        accConfirmedAt: null,
        isEdit: true,
        actualday: null,
        absent: null,
        bsc: null
      });
    if (!restored) {
      throw new BadRequestException(`Có lỗi xảy ra. Mã phiếu lương ${found.id}. Vui lòng liên hệ admin để được hỗ trợ. Xin cảm ơn.`);
    }

    return {
      status: 201,
      message: `Khôi phục thành công cho phiếu lương ${found.id} của nhân viên ${found.employee.lastName}`
    };
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }

  async findFirst(query: any) {
    return await this.repository.findFirst(query);
  }

  /// FIME: doing the same overtime
  async filterSalaries(profile: ProfileEntity, search?: Partial<SearchPayrollDto>) {
    const {total, data} = await this.repository.findSalaries(profile, search);
    const employeeIds = [...new Set(data.map(salary => salary.employee.id))];

    const payrolls = employeeIds.map(employeeId => {
      return this.overtimeOfEmployee(data, employeeId);
    });
  }

  async filterOvertime(profile: ProfileEntity, search: Partial<SearchPayrollDto>) {
    const {total, data} = await this.repository.findOvertimes(profile, search);
    const employeeIds = [...new Set(data.map(overtime => overtime.payroll.employee.id))];

    const payrolls = employeeIds.map(employeeId => {
      return this.overtimeOfEmployee(data, employeeId);
    });

    return {
      total: total,
      data: payrolls.map(payroll => {
        return Object.assign(payroll, {
          payrollId: payroll.id,
          salaries: payroll.salaries.sort((a, b) => moment.utc(a.datetime).diff(moment.utc(b.datetime))),
          salary: payroll.salary,
        });
      }),
      totalSalary: {
        total: payrolls.map(payroll => payroll.salary.total).reduce((a, b) => a + b, 0),
        unit: {
          days: payrolls.map(payroll => payroll.salary.unit.days).reduce((a, b) => a + b, 0),
          hours: payrolls.map(payroll => payroll.salary.unit.hours).reduce((a, b) => a + b, 0)
        },
      }
    };
  }

  private overtimeOfEmployee(data, employeeId) {
    const payroll = data.find(overtime => overtime.payroll.employee.id === employeeId).payroll;
    const overtimesOfEmployee = data.filter(overtime => overtime.payroll.employee.id === employeeId);

    const totalInOvertime = overtimesOfEmployee.map(salary => {
      return this.totalInOvertime(salary);
    }).reduce((a, b) => a + b, 0);

    const days = overtimesOfEmployee.filter(employee => employee.unit === DatetimeUnit.DAY || !employee.unit).map(employee => employee.times).reduce((a, b) => a + b, 0);
    const hours = overtimesOfEmployee.filter(employee => employee.unit === DatetimeUnit.HOUR).map(employee => employee.times).reduce((a, b) => a + b, 0);


    return Object.assign(payroll, {
      salaries: overtimesOfEmployee.map(overtime => _.omit(overtime, ["payroll"])),
      salary: {
        total: totalInOvertime,
        unit: {days, hours},
      },
    });
  }

  private totalInOvertime(salary) {
    if (salary.unit === DatetimeUnit.DAY && salary.times > 1) {
      return (salary.times * salary.price) + (salary.allowance?.price * salary.times);
    } else {
      return salary.times * salary.price + (salary.allowance?.price || 0);
    }
  }

  async confirmPayslip(id: number) {
    const payroll = await this.repository.findOne(id);
    return (await this.mapPayslip(payroll)).payslip;
  }

  async mapPayslip(payroll) {
    try {
      switch (payroll.recipeType) {
        case RecipeType.CT1: {
          return Object.assign(payroll, {
            payslip: payroll.accConfirmedAt
              ? await this.totalSalaryCT1(payroll)
              : null,
          });
        }
        case RecipeType.CT2: {
          return Object.assign(payroll, {
            payslip: payroll.accConfirmedAt
              ? await this.totalSalaryCT2(payroll)
              : null,
          });
        }
        case RecipeType.CT3: {
          return Object.assign(payroll, {
            payslip: payroll.accConfirmedAt
              ? await this.totalSalaryCT3(payroll)
              : null,
          });
        }
        case RecipeType.CT4: {
          return Object.assign(payroll, {
            payslip: payroll.accConfirmedAt
              ? await this.totalSalaryCT4(payroll)
              : null,
          });
        }
        case RecipeType.CT5: {
          return Object.assign(payroll, {
            payslip: payroll.accConfirmedAt
              ? await this.totalSalaryCT5(payroll)
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

  /*
   * - Front end sẽ thêm salary mới và gửi id salary lên để connect vào phiếu lương
   *     + Nếu id salary thuộc type BASIC hoặc ALLOWANCE_STAYED thì sẽ được connect thêm tới lương của nhân viên
   *     + Ngược lại sẽ chỉ connect cho payroll
   * - Chặn edit phiếu lương sau khi phiếu lương đã xác nhận
   * - Quản lý xác phiếu lương,
   * - Quỹ Xác nhận đã thanh toán phiếu lương
   * createdAt: Ngày vào làm của nhân viên
   * */
  totalAbsent(payroll: OnePayroll) {
    /// absent có time = 0 và datetime nên sẽ có giá trị khơi
    let day = 0;
    let hour = 0;
    let minute = 0;

    payroll.salaries
      ?.filter(
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
          case DatetimeUnit.TIMES: {
            break;
          }
          default:
            console.error("DatetimeUnit Unknown");
        }
      });

    return {day, hour, minute};
  }

  totalDeduction(payroll: OnePayroll) {
    return payroll.salaries
      .filter(salary => salary.type === SalaryType.DEDUCTION)
      .map(salary => salary.price)
      .reduce((a, b) => a + b, 0);
  }

  totalAllowanceByActual(payroll: OnePayroll, actualDay: number, workday?: number) {
    const allowanceFullActual = payroll.salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ALLOWANCE &&
          salary.unit === DatetimeUnit.DAY &&
          !salary.datetime
      )
      ?.map((salary) => salary.price)
      ?.reduce((a, b) => a + b, 0) * actualDay;

    const allowanceFromDate = payroll.salaries
      .filter(
        (salary) =>
          salary.type === SalaryType.ALLOWANCE &&
          salary.unit === DatetimeUnit.DAY &&
          salary.datetime
      )
      ?.map((salary) => {

        // Lấy từ ngày đến ngày
        const start = moment(salary.datetime, "YYYY-MM-DD");
        const end = moment(lastDatetime(payroll.createdAt), "YYYY-MM-DD");

        // lấy những ngày vắng thuộc từ ngày bắt đầu tính tới cuối tháng
        const absents = payroll.salaries
          .filter(salary => (salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF) && start.isBefore(salary.datetime))
          .map(salary => salary.times)
          .reduce((a, b) => a + b, 0);

        const day = moment.duration(end.diff(start)).days() + 1 - absents;
        return (salary.price / workday) * day;
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
      ?.map((salary) => {
        if (salary?.price) {
          return salary.price * salary.times + (salary.allowance?.price * (salary.allowance?.times || 1) || 0);
        }
        // Tăng ca đêm cho nhân viên văn phòng chính
        return this.totalBasicSalary(salaries) / 26 * salary.times;
      })
      ?.reduce((a, b) => a + b, 0);
  }

  totalActualDay(payroll: OnePayroll) {
    let total = 30;
    // total: Ngày cuối cùng của tháng do mình quy định. Áp dụng đối với lương cố dịnh
    const confirmedAt = payroll.accConfirmedAt;
    if (!confirmedAt) {
      if (payroll.isFlatSalary) {
        total = 30;
      } else {
        if (isEqualDatetime(new Date(), payroll.createdAt, "month")) {
          total = new Date().getDate() + 1 - payroll.createdAt.getDate();
        } else if (moment(new Date()).isAfter(payroll.createdAt, "month")) {
          total = lastDatetime(payroll.createdAt).getDate() + new Date().getDate();
        } else {
          throw new BadRequestException("Phiếu lương chưa xác nhận có ngày nhỏ hơn ngày tạo phiếu lương");
        }
      }
    } else {
      if (payroll.isFlatSalary) {
        total = 30;
      } else if (isEqualDatetime(confirmedAt, payroll.createdAt, "month")) {
        total = confirmedAt.getDate() + 1 - payroll.createdAt.getDate();
      } else if (moment(confirmedAt).isAfter(payroll.createdAt, "month")) {
        total = lastDatetime(payroll.createdAt).getDate() + confirmedAt.getDate() + 1;
      } else {
        throw new BadRequestException("Phiếu lương đã xác nhận có ngày nhỏ hơn ngày tạo phiếu lương");
      }
    }
    // absent trừ cho ngày vào làm nếu ngày vào làm là tháng đc tính lương
    const absent = this.totalAbsent(payroll);
    return total - absent.day;
  }

  totalForgotBSC(salaries: Salary[]) {
    return salaries
      .filter(salary => salary.type === SalaryType.ABSENT && (salary.unit === DatetimeUnit.TIMES || salary.forgot))
      .map(salary => salary.times)
      .reduce((a, b) => a + b, 0);
  }

  async generateHoliday(payrollId: number, isValidate = true) {
    // throw new BadRequestException("Tính năng đang trong giai đoạn bảo trì. Thời gian hoàn thành dự kiến chưa xác định. Xin cảm ơn");
    let worksInHoliday = [];
    let worksNotInHoliday = [];

    const payroll = await this.findOne(payrollId);
    const currentHoliday = await this.repository.findCurrentHolidays(payroll.createdAt, payroll.employee.positionId);
    if (!currentHoliday.length && isValidate) {
      throw new NotFoundException(`Không tồn tại ngày lễ hợp lệ trong tháng ${moment(payroll.createdAt).format("MM/YYYY")}`);
    }
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
          const salary = salaries.filter((salary) => isEqualDatetime(salary.datetime, currentHoliday[i].datetime));
          if (salary.length === 1 && salary[0].times === PARTIAL_DAY && salary[0].unit === DatetimeUnit.DAY) {
            /// Warning: update lại rate để tránh trùng với rate ngày nghỉ

            worksInHoliday.push(Object.assign(salary, {times: PARTIAL_DAY, rate: currentHoliday[i].rate}));
          }
        } else {
          worksInHoliday.push(Object.assign(currentHoliday[i], {
            times: ALL_DAY,
            title: currentHoliday[i].name,
            rate: currentHoliday[i].rate
          }));
        }
      }
    }

    if (worksInHoliday?.length) {
      await this.repository.generateHoliday(payrollId, worksInHoliday);
    } else {
      await this.repository.generateHoliday(payrollId, null);
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
    // datetime
    const currentHoliday = await this.repository.findCurrentHolidays(payroll.createdAt, payroll.employee.positionId);
    const workday = payroll.workday;

    // day
    const actualDay = this.totalActualDay(payroll);

    const absents = payroll.salaries.filter(
      (salary) => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF
    );

    // salary
    const basicSalary = this.totalBasicSalary(payroll.salaries);

    // salary
    const basic = payroll.salaries.find(
      (salary: Salary) => salary.type === SalaryType.BASIC_INSURANCE
    )?.price;

    const absent = this.totalAbsent(payroll);
    const basicDaySalary = basicSalary / payroll.workday;
    const staySalary =
      actualDay >= workday
        ? this.totalStaySalary(payroll.salaries)
        : (this.totalStaySalary(payroll.salaries) / workday) * actualDay;

    // datetime
    const worksInHoliday = [];
    const worksNotInHoliday = [];
    // Get ngày Không đi làm trong ngày lễ để hiển thị ra UI
    //
    currentHoliday.forEach(holiday => {
      if (includesDatetime(absents.map(absent => absent.datetime), holiday.datetime)) {
        for (let i = 0; i < absents.length; i++) {
          if (isEqualDatetime(holiday.datetime, absents[i].datetime, "day")) {
            if (!holiday.isConstraint) {
              if (absents[i].times === PARTIAL_DAY) {
                worksInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime, rate: holiday.rate});

                worksNotInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime, rate: holiday.rate});
              } else {
                worksNotInHoliday.push({day: ALL_DAY, datetime: holiday.datetime, rate: holiday.rate});
              }
            } else {
              if (absents[i].times === PARTIAL_DAY) {
                worksInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime, rate: holiday.rate});
              }
            }
          }
        }
      } else {
        if (!holiday.isConstraint || (holiday.isConstraint && actualDay > workday)) {
          // case: Đi làm lễ nguyên ngày nhưng trong tháng dó ngày công thực tế chỉ dư ra 0.5 ngày so với ngày công chuẩn.
          /// FIXME: Còn thiếu case Nếu dư ra 1 ngày hoặc 0.5 ngày nhưng tháng đó đi làm cả 2 ngày lễ và 2 ngày lễ có rate khác nhau là x2, x3 thì sẽ áp dụng cho lễ nào

          // tổng ngày lễ đã được thêm vào
          // const day = worksInHoliday.map(w => w?.day || 0).reduce((a, b) => a + b, 0);
          worksInHoliday.push({
            day: ALL_DAY,
            datetime: holiday.datetime,
            rate: holiday.rate
          });
        }
      }
    });

    const absentNotInHoliday = payroll.salaries
      .filter(salary => salary.type === (SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF))
      .filter(salary => !includesDatetime(currentHoliday.map(holiday => holiday.datetime), salary.datetime))
      .map(salary => salary.times)
      .reduce((a, b) => a + b, 0);

    // Ngày công đi làm  trong ngày lễ
    const workdayInHoliday = worksInHoliday.map((date) => date.day).reduce((a, b) => a + b, 0);
    const workdayNotInHoliday = actualDay - workdayInHoliday;

    // Quét qua số ngày đi làm thực tế để kiểm tra đkien đủ hoặc đi làm dư ngày so với ngày thực tế mới thỏa mãn nhận lương nhân hệ số.
    /// FIXME: issue 293
    // const actualDayInHoliday = worksInHoliday.map(w => w.day).reduce((a, b) => a + b, 0) - (actualDay - workday);
    //
    // console.warn(actualDayInHoliday)

    // Đi làm nhưng không thuộc ngày lễ x2
    const payslipOutOfWorkday = workdayNotInHoliday - workday > 0
      ? (workdayNotInHoliday - workday) * basicDaySalary * RATE_OUT_OF_WORK_DAY
      : 0;

    const allowanceDayByActual = this.totalAllowanceByActual(payroll, actualDay, workday);

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
    const isConstraint = currentHoliday.every(holiday => {
      return holiday.isConstraint;
    });

    const notWorkdayInHoliday = worksNotInHoliday.map(date => date.day).reduce((a, b) => a + b, 0);

    const payslipInHoliday = worksInHoliday.map(w => {
      return basicDaySalary * w.rate * w.day;
    }).reduce((a, b) => a + b, 0);

    const payslipNotInHoliday = basicDaySalary * notWorkdayInHoliday;

    const payslipNormalDay = !isConstraint
      ? basicDaySalary * (workdayNotInHoliday >= workday ? workday : workdayNotInHoliday)
      : basicDaySalary * (actualDay > workday ? workday : actualDay);

    const totalStandard = basicSalary + staySalary;
    const tax = payroll.taxed ? basic * payroll.tax : 0;

    const bsc = this.totalForgotBSC(payroll.salaries);
    const bscSalary = basicDaySalary * (bsc / 2);

    const deduction = absent.minute * ((basicSalary + this.totalStaySalary(payroll.salaries)) / workday / 8 / 60) + this.totalDeduction(payroll);

    const total = Math.round((payslipNormalDay + payslipInHoliday + payslipNotInHoliday + payslipOutOfWorkday + staySalary + allowanceTotal + overtime - tax - bscSalary - deduction) / 1000) * 1000;

    /// FIXME: TESTING. DON'T DELETE IT
    // console.warn("Lương cơ bản", basicSalary);
    // console.warn("Ngày công chuẩn", workday);
    // console.warn("Ngày công trừ ngày lễ / tết", workdayNotInHoliday);
    // console.warn("Tổng Lương thực nhận", actualDay);
    // console.warn("Tổng lương đi làm ngày lễ", payslipInHoliday);
    // console.warn("Tổng lương không đi làm ngày lễ ", payslipNotInHoliday);
    // console.warn("Tổng lương đi làm ngoài ngày lễ( x2 )", payslipOutOfWorkday);
    // console.warn("Tổng lương ngày đi làm thực tế trừ lễ: ", payslipNormalDay);
    // console.warn("Tổng phụ cấp", staySalary);
    //
    // console.warn("=====================================================");
    //
    // console.warn("Tổng lương ngày đi làm thực tế trừ lễ", payslipNormalDay);
    // console.warn("Tổng lương đi làm ngày lễ", payslipInHoliday);
    // console.warn("Lương 1 ngày công", basicDaySalary);
    // console.warn("Tổng phụ cấp", staySalary);
    // console.warn("Thuees", tax);
    // console.warn("Tổng tiền tăng ca", overtime);

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
      deduction: deduction,
      overtime: overtime,
      bsc,
      bscSalary,
      totalStandard,
      payslipOutOfWorkday,
      allowance: allowanceTotal,
      tax: tax,
      total
    };
  }

  /**
   *CT2:
   * 1. actual >= workday                  => result = (basics / workday) x workday + stays + allowances
   * 2. actual < workday                  => result = [(basics + stays) / workday] x actual + allowances
   * 3. isFlat === true && absents !== 0  => actual = workday (Dù tháng đó có bao nhiêu ngày đi chăng nữa). else quay lại 1 & 2
   */
  async totalSalaryCT2(payroll: OnePayroll) {
    let tax = 0;
    let basicDaySalary = 0;
    let payslipInHoliday = 0;
    let payslipNotInHoliday = 0;
    //datetime
    const currentHoliday = await this.repository.findCurrentHolidays(payroll.createdAt, payroll.employee.positionId);
    const workday = payroll.workday;

    let actualDay = this.totalActualDay(payroll);

    // basic
    const basicSalary = this.totalBasicSalary(payroll.salaries);
    const staySalary = this.totalStaySalary(payroll.salaries);

    // Phụ cấp theo tháng
    const allowanceMonthSalary = this.totalAllowanceMonthSalary(payroll.salaries);
    /// FIXME: Phụ cấp từ ngày đến ngày. Chưa cần dùng tới
    const allowanceDayRangeSalary = this.totalAllowanceDayRangeSalary(payroll.salaries);
    const allowanceDayByActual = this.totalAllowanceByActual(payroll, actualDay, workday);

    if (actualDay >= workday) {
      basicDaySalary = basicSalary / workday;
    } else {
      basicDaySalary = (basicSalary + staySalary) / workday;
    }

    const basic = payroll.salaries.find(
      (salary) => salary.type === SalaryType.BASIC_INSURANCE
    );

    // Thuế dựa theo lương cơ bản BASIC_INSURANCE
    if (basic) {
      tax = payroll.taxed ? basic.price * payroll.tax : 0;
    }

    const allowanceTotal = allowanceMonthSalary + allowanceDayByActual;

    if (currentHoliday && currentHoliday.length) {
      for (let i = 0; i < currentHoliday.length; i++) {
        const salaries = payroll.salaries.filter(salary => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF);
        const isAbsentInHoliday = includesDatetime(salaries.map(salary => salary.datetime), currentHoliday[i].datetime);
        if (isAbsentInHoliday) {
          for (let j = 0; j < salaries.length; j++) {
            if (isEqualDatetime(salaries[j].datetime, currentHoliday[i].datetime)) {
              if (salaries[j].times === PARTIAL_DAY) {
                /// FIXME: confirm lại nếu đi làm ngày lễ nhưng đkien ngày thực tế > ngày công chuẩn mới được hưởng thưởng hay k cần điều kiện. Nếu không cần thì bỏ đkien đi
                // Đi làm nửa ngày thì dược hưởng nửa thưởng
                // if (actualDay >= workday) {
                payslipInHoliday += currentHoliday[i].price / 2;
                // }
              } else if (salaries[j].times === 1) {
                // Vắng trong ngày lễ thì k đc tiền.
              } else {
                throw new BadRequestException(
                  `${payroll.employee.lastName} ngày ${payroll.createdAt} có thời gian làm ngày lễ không hợp lệ`
                );
              }
            }
          }
        } else {
          /// FIXME: confirm lại nếu đi làm ngày lễ nhưng đkien ngày thực tế > ngày công chuẩn mới được hưởng thưởng hay k cần điều kiện. Nếu không cần thì bỏ đkien đi
          // if (actualDay >= workday) {
          payslipInHoliday += currentHoliday[i].price;
          // }
        }
      }
    }

    const overtimeSalary = this.totalOvertime(payroll.salaries);
    const absent = this.totalAbsent(payroll);

    //  số lần quên bsc. 1 lần thì bị trừ 0.5 ngày
    const bsc = this.totalForgotBSC(payroll.salaries);

    const bscSalary = (bsc / 2) * basicSalary / PAYSLIP_WORKDAY_HOLIDAY;

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
      if (includesDatetime(absents.map(absent => absent.datetime), holiday.datetime)) {
        for (let i = 0; i < absents.length; i++) {
          if (isEqualDatetime(absents[i].datetime, holiday.datetime)) {
            if (absents[i].times === PARTIAL_DAY) {
              worksInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime});
              worksNotInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime});
            } else {
              worksNotInHoliday.push({day: ALL_DAY, datetime: holiday.datetime});
            }
          }
        }
      } else {
        worksInHoliday.push({day: ALL_DAY, datetime: holiday.datetime});
      }
    });

    // Tổng tiền đi trễ. Ngày nghỉ là ngày đã đc trừ trên ngày đi làm thực tế, nên sẽ không tính vào tiền khấu trừ
    const deductionSalary = absent.minute * ((basicSalary + staySalary) / workday / 8 / 60) + this.totalDeduction(payroll);

    // Không quan tâm đến ngày công thực tế hay ngày công chuẩn. Nếu không đi làm trong ngày lễ thì vẫn được hưởng lương như thường
    payslipNotInHoliday = worksNotInHoliday.map(w => w.day).reduce((a, b) => a + b, 0) * (basic.price / PAYSLIP_WORKDAY_HOLIDAY);

    let total: number;
    if (actualDay >= workday) {
      total = basicDaySalary * actualDay + Math.ceil(allowanceTotal) + staySalary + payslipInHoliday + payslipNotInHoliday + overtimeSalary - deductionSalary - bscSalary - tax;
    } else {
      total = basicDaySalary * actualDay + Math.ceil(allowanceTotal) + payslipInHoliday + payslipNotInHoliday + overtimeSalary - deductionSalary - bscSalary - tax;
    }

    return {
      basic: Math.ceil(basicSalary),
      stay: Math.ceil(staySalary),
      overtime: overtimeSalary,
      allowance: allowanceTotal,
      payslipInHoliday,
      payslipNotInHoliday,
      workdayNotInHoliday: workdayNotInHoliday,
      worksInHoliday,
      worksNotInHoliday,
      payslipOutOfWorkday: 0,
      deduction: deductionSalary,
      daySalary: basicDaySalary,
      totalWorkday: actualDay,
      workday: workday,
      bsc,
      bscSalary: bscSalary,
      payslipNormalDay: Math.ceil(basicDaySalary * actualDay),
      tax: tax,
      total: Math.round(total / 1000) * 1000,
    };
  }

  /// áp dụng cho tinh lương công nhật. Thuê ngoài làm mà không phải nhân viên công ty
  totalSalaryCT3(payroll: OnePayroll) {
    const workdays = payroll.salaries.filter(salary => salary.type === SalaryType.PART_TIME && salary.unit === DatetimeUnit.DAY);
    const times = payroll.salaries.filter(salary => salary.type === SalaryType.OVERTIME && salary.unit === DatetimeUnit.HOUR);
    const totalSalaryWorkday = workdays.map(salary => salary.type === SalaryType.PART_TIME && salary.times * salary.price).reduce((a, b) => a + b, 0);
    const totalSalaryTimes = times.map(salary => salary.type === SalaryType.OVERTIME && salary.times * salary.price).reduce((a, b) => a + b, 0);
    return {
      workdays: workdays.map(salary => salary.times).reduce((a, b) => a + b, 0),
      totalSalaryWorkday,
      times: times.map(salary => salary.times).reduce((a, b) => a + b, 0),
      totalSalaryTimes,
      total: totalSalaryWorkday + totalSalaryTimes
    };
  }

  // áp dụng cho khối văn phòng chính
  async totalSalaryCT4(payroll: OnePayroll) {
    let tax = 0;
    let basicDaySalary = 0;
    let payslipInHoliday = 0;
    let payslipNotInHoliday = 0;
    //datetime
    const currentHoliday = await this.repository.findCurrentHolidays(payroll.createdAt, payroll.employee.positionId);
    const workday = payroll.workday;

    let actualDay = this.totalActualDay(payroll);

    // basic
    const basicSalary = this.totalBasicSalary(payroll.salaries);
    const staySalary = this.totalStaySalary(payroll.salaries);

    // Phụ cấp theo tháng
    const allowanceMonthSalary = this.totalAllowanceMonthSalary(payroll.salaries);
    /// FIXME: Phụ cấp từ ngày đến ngày. Chưa cần dùng tới
    const allowanceDayRangeSalary = this.totalAllowanceDayRangeSalary(payroll.salaries);
    const allowanceDayByActual = this.totalAllowanceByActual(payroll, actualDay, workday);

    if (actualDay >= workday) {
      basicDaySalary = basicSalary / workday;
    } else {
      basicDaySalary = (basicSalary + staySalary) / workday;
    }

    const basic = payroll.salaries.find(
      (salary) => salary.type === SalaryType.BASIC_INSURANCE
    );
    // Thuế dựa theo lương cơ bản BASIC_INSURANCE
    if (basic) {
      tax = payroll.taxed ? basic.price * payroll.tax : 0;
    }
    const allowanceTotal = allowanceMonthSalary + allowanceDayByActual;

    if (currentHoliday && currentHoliday.length) {
      for (let i = 0; i < currentHoliday.length; i++) {
        const salaries = payroll.salaries.filter(salary => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF);
        const isAbsentInHoliday = includesDatetime(salaries.map(salary => salary.datetime), currentHoliday[i].datetime);
        if (isAbsentInHoliday) {
          for (let j = 0; j < salaries.length; j++) {
            if (isEqualDatetime(salaries[j].datetime, currentHoliday[i].datetime)) {
              if (salaries[j].times === PARTIAL_DAY) {
                /// FIXME: confirm lại nếu đi làm ngày lễ nhưng đkien ngày thực tế > ngày công chuẩn mới được hưởng thưởng hay k cần điều kiện. Nếu không cần thì bỏ đkien đi
                // Đi làm nửa ngày thì dược hưởng nửa thưởng
                // if (actualDay >= workday) {
                payslipInHoliday += currentHoliday[i].price / 2;
                // }
              } else if (salaries[j].times === 1) {
                // Vắng trong ngày lễ thì k đc tiền.
              } else {
                throw new BadRequestException(
                  `${payroll.employee.lastName} ngày ${payroll.createdAt} có thời gian làm ngày lễ không hợp lệ`
                );
              }
            }
          }
        } else {
          /// FIXME: confirm lại nếu đi làm ngày lễ nhưng đkien ngày thực tế > ngày công chuẩn mới được hưởng thưởng hay k cần điều kiện. Nếu không cần thì bỏ đkien đi
          // if (actualDay >= workday) {
          payslipInHoliday += currentHoliday[i].price;
          // }
        }
      }
    }

    const overtimeSalary = this.totalOvertime(payroll.salaries);
    // payroll.salaries
    // .filter(salary => salary.type === SalaryType.OVERTIME)
    // .map(salary => (basicSalary / workday) * salary.times)
    // .reduce((a, b) => a + b, 0);

    const absent = this.totalAbsent(payroll);

    //  số lần quên bsc. 1 lần thì bị trừ 0.5 ngày
    const bsc = this.totalForgotBSC(payroll.salaries);

    const bscSalary = (bsc / 2) * basicSalary / PAYSLIP_WORKDAY_HOLIDAY;

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
      if (includesDatetime(absents.map(absent => absent.datetime), holiday.datetime)) {
        for (let i = 0; i < absents.length; i++) {
          if (isEqualDatetime(absents[i].datetime, holiday.datetime)) {
            if (absents[i].times === PARTIAL_DAY) {
              worksInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime});
              worksNotInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime});
            } else {
              worksNotInHoliday.push({day: ALL_DAY, datetime: holiday.datetime});
            }
          }
        }
      } else {
        worksInHoliday.push({day: ALL_DAY, datetime: holiday.datetime});
      }
    });

    // Tổng tiền đi trễ. Ngày nghỉ là ngày đã đc trừ trên ngày đi làm thực tế, nên sẽ không tính vào tiền khấu trừ
    const deductionSalary = absent.minute * (basicSalary / workday / 8 / 60) + this.totalDeduction(payroll);

    // Không quan tâm đến ngày công thực tế hay ngày công chuẩn. Nếu không đi làm trong ngày lễ thì vẫn được hưởng lương như thường
    payslipNotInHoliday = worksNotInHoliday.map(w => w.day).reduce((a, b) => a + b, 0) * (basic.price / PAYSLIP_WORKDAY_HOLIDAY);

    /// FIXME: TESTING. DON'T DELETE IT
    // console.warn("Lương cơ bản", basicSalary);
    // console.warn("Ngày công chuẩn", workday);
    // console.warn("Ngày công thực tế trừ ngày lễ", workdayNotInHoliday);
    // console.warn("Tổng ngày công thực nhận lương", totalWorkday);
    // console.warn("Tổng lương đi làm ngày lễ", payslipInHoliday);
    // console.warn("Lương không đi làm ngày lễ", payslipNotInHoliday);
    // console.warn("Tổng phụ cấp", staySalary);
    // console.warn("Tổng tiền khấu trừ", absentDaySalary);
    //
    // console.warn("=====================================================");
    //
    // console.warn("Tổng lương đi làm ngày lễ", payslipInHoliday);
    // console.warn("Tổng phụ cấp", staySalary);
    // console.warn("Thuees", tax);
    // console.warn("Tổng tiền tăng ca", overtimeSalary);
    // console.warn("total", total);

    let total: number;
    if (actualDay >= workday) {
      total = basicDaySalary * actualDay + Math.ceil(allowanceTotal) + staySalary + payslipInHoliday + payslipNotInHoliday + overtimeSalary - deductionSalary - bscSalary - tax;
    } else {
      total = basicDaySalary * actualDay + Math.ceil(allowanceTotal) + payslipInHoliday + payslipNotInHoliday + overtimeSalary - deductionSalary - bscSalary - tax;
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
      payslipOutOfWorkday: 0,
      deduction: deductionSalary,
      daySalary: basicDaySalary,
      totalWorkday: actualDay,
      workday: workday,
      bsc,
      bscSalary: bscSalary,
      payslipNormalDay: Math.ceil(basicDaySalary * actualDay),
      tax: tax,
      total: Math.round(total / 1000) * 1000,
    };
  }

  // áp dụng cho trại ấp
  async totalSalaryCT5(payroll: OnePayroll) {
    let tax = 0;
    let basicDaySalary = 0;
    let payslipInHoliday = 0;
    let payslipNotInHoliday = 0;
    //datetime
    const currentHoliday = await this.repository.findCurrentHolidays(payroll.createdAt, payroll.employee.positionId);
    const workday = payroll.workday;

    let actualDay = this.totalActualDay(payroll);

    // basic
    const basicSalary = this.totalBasicSalary(payroll.salaries);
    const staySalary = this.totalStaySalary(payroll.salaries);

    // Phụ cấp theo tháng
    const allowanceMonthSalary = this.totalAllowanceMonthSalary(payroll.salaries);
    /// FIXME: Phụ cấp từ ngày đến ngày. Chưa cần dùng tới
    const allowanceDayRangeSalary = this.totalAllowanceDayRangeSalary(payroll.salaries);
    const allowanceDayByActual = this.totalAllowanceByActual(payroll, actualDay, workday);

    if (actualDay >= workday) {
      basicDaySalary = basicSalary / workday;
    } else {
      basicDaySalary = (basicSalary + staySalary) / workday;
    }

    const basic = payroll.salaries.find(
      (salary) => salary.type === SalaryType.BASIC_INSURANCE
    );

    // Thuế dựa theo lương cơ bản BASIC_INSURANCE
    if (basic) {
      tax = payroll.taxed ? basic.price * payroll.tax : 0;
    }

    const allowanceTotal = allowanceMonthSalary + allowanceDayByActual;

    if (currentHoliday && currentHoliday.length) {
      for (let i = 0; i < currentHoliday.length; i++) {
        const salaries = payroll.salaries.filter(salary => salary.type === SalaryType.ABSENT || salary.type === SalaryType.DAY_OFF);
        const isAbsentInHoliday = includesDatetime(salaries.map(salary => salary.datetime), currentHoliday[i].datetime);
        if (isAbsentInHoliday) {
          for (let j = 0; j < salaries.length; j++) {
            if (isEqualDatetime(salaries[j].datetime, currentHoliday[i].datetime)) {
              if (salaries[j].times === PARTIAL_DAY) {
                /// FIXME: confirm lại nếu đi làm ngày lễ nhưng đkien ngày thực tế > ngày công chuẩn mới được hưởng thưởng hay k cần điều kiện. Nếu không cần thì bỏ đkien đi
                // Đi làm nửa ngày thì dược hưởng nửa thưởng
                // if (actualDay >= workday) {
                payslipInHoliday += currentHoliday[i].price / 2;
                // }
              } else if (salaries[j].times === 1) {
                // Vắng trong ngày lễ thì k đc tiền.
              } else {
                throw new BadRequestException(
                  `${payroll.employee.lastName} ngày ${payroll.createdAt} có thời gian làm ngày lễ không hợp lệ`
                );
              }
            }
          }
        } else {
          /// FIXME: confirm lại nếu đi làm ngày lễ nhưng đkien ngày thực tế > ngày công chuẩn mới được hưởng thưởng hay k cần điều kiện. Nếu không cần thì bỏ đkien đi
          // if (actualDay >= workday) {
          payslipInHoliday += currentHoliday[i].price;
          // }
        }
      }
    }

    const overtimeSalary = this.totalOvertime(payroll.salaries);
    const absent = this.totalAbsent(payroll);

    //  số lần quên bsc. 1 lần thì bị trừ 0.5 ngày
    const bsc = this.totalForgotBSC(payroll.salaries);

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
      if (includesDatetime(absents.map(absent => absent.datetime), holiday.datetime)) {
        for (let i = 0; i < absents.length; i++) {
          if (isEqualDatetime(holiday.datetime, absents[i].datetime, "day")) {
            if (!holiday.isConstraint) {
              if (absents[i].times === PARTIAL_DAY) {
                worksInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime, rate: holiday.rate});

                worksNotInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime, rate: holiday.rate});
              } else {
                worksNotInHoliday.push({day: ALL_DAY, datetime: holiday.datetime, rate: holiday.rate});
              }
            } else {
              if (absents[i].times === PARTIAL_DAY) {
                worksInHoliday.push({day: PARTIAL_DAY, datetime: holiday.datetime, rate: holiday.rate});
              }
            }
          }
        }
      } else {
        if (!holiday.isConstraint || (holiday.isConstraint && actualDay > workday)) {
          // case: Đi làm lễ nguyên ngày nhưng trong tháng dó ngày công thực tế chỉ dư ra 0.5 ngày so với ngày công chuẩn.
          /// FIXME: Còn thiếu case Nếu dư ra 1 ngày hoặc 0.5 ngày nhưng tháng đó đi làm cả 2 ngày lễ và 2 ngày lễ có rate khác nhau là x2, x3 thì sẽ áp dụng cho lễ nào

          // tổng ngày lễ đã được thêm vào
          // const day = worksInHoliday.map(w => w?.day || 0).reduce((a, b) => a + b, 0);
          worksInHoliday.push({
            day: ALL_DAY,
            datetime: holiday.datetime,
            rate: holiday.rate
          });
        }
      }
    });

    const bscSalary = (bsc / 2) * basicSalary / PAYSLIP_WORKDAY_HOLIDAY;

    // Tổng tiền đi trễ. Ngày nghỉ là ngày đã đc trừ trên ngày đi làm thực tế, nên sẽ không tính vào tiền khấu trừ
    const deductionSalary = absent.minute * ((basicSalary + staySalary) / workday / 8 / 60) + this.totalDeduction(payroll);

    // Không quan tâm đến ngày công thực tế hay ngày công chuẩn. Nếu không đi làm trong ngày lễ thì vẫn được hưởng lương như thường
    payslipNotInHoliday = worksNotInHoliday.map(w => w.day).reduce((a, b) => a + b, 0) * (basic.price / PAYSLIP_WORKDAY_HOLIDAY);

    let total: number;
    if (actualDay >= workday) {
      total = basicDaySalary * actualDay + Math.ceil(allowanceTotal) + staySalary + payslipInHoliday + payslipNotInHoliday + overtimeSalary - deductionSalary - bscSalary - tax;
    } else {
      total = basicDaySalary * actualDay + Math.ceil(allowanceTotal) + payslipInHoliday + payslipNotInHoliday + overtimeSalary - deductionSalary - bscSalary - tax;
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
      payslipOutOfWorkday: 0,
      deduction: deductionSalary,
      daySalary: basicDaySalary,
      totalWorkday: actualDay,
      workday: workday,
      bsc,
      bscSalary: bscSalary,
      payslipNormalDay: Math.ceil(basicDaySalary * actualDay),
      tax: tax,
      total: Math.round(total / 1000) * 1000,
    };
  }

  async overtimeTemplate(search: SearchSalaryDto) {
    const data = await this.repository.overtimeTemplate(search);
    return data.map(e => e.title);
  }


  async export(
    response: Response,
    profile: ProfileEntity,
    search: SearchExportDto,
    items: ItemExportDto[],
  ) {
    try {
      const customs = items.reduce((a, v, index) => ({...a, [v['key']]: v['value']}), {});

      const data = await this.findAll(profile, Object.assign(search, {filterType: search.exportType}));

      const res = data.data.map((payroll) => {
          let exportType;
          switch (search?.exportType) {
            case FilterTypeEnum.PAYROLL: {
              if (!payroll.accConfirmedAt) {
                throw new BadRequestException(`Mã nhân viên ${payroll.employee.id} chưa được xác nhận phiếu lương. Vui lòng xác nhận phiếu lương để in.`);
              }
              exportType = {
                payslip: Object.assign(payroll.payslip, {
                  worksInHoliday: payroll?.payslip?.worksInHoliday?.map(holiday => holiday?.day)?.reduce((a, b) => a + b, 0),
                  worksNotInHoliday: payroll?.payslip?.worksNotInHoliday?.map(holiday => holiday?.day)?.reduce((a, b) => a + b, 0),
                })
              };
              break;
            }
            case FilterTypeEnum.SEASONAL: {
              exportType = {
                lastName: payroll.employee.lastName,
                branch: payroll.branch,
                position: payroll.position,
                datetime: convertArrayToString(payroll.salaries.map(salary => salary.datetime ? moment(salary.datetime).format("DD/MM/YYYY") : moment(payroll.createdAt).format("MM/YYYY"))),
                title: convertArrayToString(payroll.salaries.map(salary => salary.title)),
                workdays: payroll.payslip.workdays,
                totalSalaryWorkday: payroll.payslip.totalSalaryWorkday,
                times: payroll.payslip.times,
                totalSalaryTimes: payroll.payslip.totalSalaryTimes,
                total: payroll.payslip.total,
              };
              break;
            }
            case FilterTypeEnum.OVERTIME:
            case FilterTypeEnum.BASIC:
            case FilterTypeEnum.STAY:
            case FilterTypeEnum.ALLOWANCE:
            case FilterTypeEnum.TIME_SHEET:
            case FilterTypeEnum.ABSENT: {
              exportType = {
                lastName: payroll.employee.lastName,
                branch: payroll.branch,
                position: payroll.position,
                datetime: convertArrayToString(payroll.salaries.filter(salary => salary.datetime).map(salary => moment(salary.datetime).format("DD/MM/YYYY"))),
                title: convertArrayToString(payroll.salaries.map(salary => {
                  if (salary?.allowance?.title) {
                    return salary.title + " + " + salary?.allowance?.title;
                  }
                  return salary.title;
                })),
                price: convertArrayToString(payroll.salaries.map(salary => {
                  if (salary?.allowance?.price) {
                    return salary.price + " + " + salary?.allowance?.price;
                  }
                  return salary.price;
                })),
                unit: payroll?.salary?.unit?.days + " ngày, " + payroll?.salary?.unit?.hours + " giờ",
                total: payroll?.salary?.total,
              };
              break;
            }
          }
          return Object.assign(payroll, exportType);
        }
      );

      switch (search?.exportType) {
        case FilterTypeEnum.PAYROLL: {
          return this.exportPayroll(response, search, res, Object.values(customs), Object.keys(customs));
        }
        case FilterTypeEnum.TIME_SHEET: {
          return this.exportTimeSheet(response, search, res, Object.values(customs), Object.keys(customs));
        }
        case FilterTypeEnum.SEASONAL: {
          return this.exportSeasonal(response, search, res, Object.values(customs), Object.keys(customs));
        }
        case FilterTypeEnum.OVERTIME: {
          return this.exportOvertime(response, search, res, (data as any).totalSalary, Object.values(customs), Object.keys(customs));
        }
        case FilterTypeEnum.BASIC:
        case FilterTypeEnum.STAY:
        case FilterTypeEnum.ALLOWANCE:
        case FilterTypeEnum.ABSENT: {
          return this.exportSalaries(response, search, res, Object.values(customs), Object.keys(customs));
        }
      }

    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async exportPayroll(response: Response, search: SearchExportDto, data, headers: string[], keys: string[]) {
    const payrolls = await Promise.all(
      data.map(async (payroll) => {
        const name = payroll.employee.lastName;
        const position = payroll.employee.position.name;
        return Object.assign(payroll.payslip, {name, position});
      })
    );

    return exportExcel(
      response,
      {
        name: search.filename,
        title: `Bảng lương tháng ${moment(search.startedAt).format("MM-YYYY")}`,
        customHeaders: headers,
        customKeys: keys,
        data: payrolls,
      },
      200
    );
  }

  exportTimeSheet(response: Response, search: SearchExportDto, payrolls, headers: string[], keys: string[]) {
    const datetimes = rageDateTime(firstDatetime(search.startedAt), lastDatetime(search.endedAt)).map(date => date.format("DD-MM"));
    const customHeaders = [...headers, ...datetimes];
    const customKeys = [...keys, ...datetimes];

    const data = payrolls.map(payroll => {
      payroll.employee = Object.assign(payroll.employee, {
        lastName: payroll.employee.lastName,
        branch: payroll.employee.branch.name,
        position: payroll.employee.position.name
      });

      const times = timesheet(payroll).datetime
        .map((e, index) => {
          return e[datetimes[index]];
        });
      times.unshift(...keys.map(key => payroll.employee[key]));
      return times;
    });

    return exportExcel(
      response,
      {
        name: search.filename,
        customKeys: customKeys,
        title: `Phiếu Chấm công tháng `,
        customHeaders: customHeaders,
        data: data,
      },
      201
    );
  }

  exportSeasonal(response: Response, search: SearchExportDto, payrolls: any[], headers: string[], keys: string[]) {
    const total = {
      lastName: "Tổng cộng",
      branch: "",
      position: "",
      datetime: "",
      title: "",
      workdays: payrolls.map(payroll => payroll.payslip.workdays).reduce((a, b) => a + b, 0),
      totalSalaryWorkday: payrolls.map(payroll => payroll.payslip.totalSalaryWorkday).reduce((a, b) => a + b, 0),
      times: payrolls.map(payroll => payroll.payslip.times).reduce((a, b) => a + b, 0),
      totalSalaryTimes: payrolls.map(payroll => payroll.payslip.totalSalaryTimes).reduce((a, b) => a + b, 0),
      total: payrolls.map(payroll => payroll.payslip.total).reduce((a, b) => a + b, 0),
    };
    payrolls.push(total);
    return exportExcel(
      response,
      {
        name: search.filename,
        title: `Bảng lương công nhật tháng ${moment(search.startedAt).format("MM-YYYY")}`,
        customHeaders: headers,
        customKeys: keys,
        data: payrolls,
      },
      200
    );
  }

  exportSalaries(response: Response, search: SearchExportDto, payrolls: any[], headers: string[], keys: string[]) {
    const title = [...new Set(payrolls.map(payroll => payroll.title).filter(payroll => payroll !== ""))];
    const titleLength = title.length;
    return exportExcel(
      response,
      {
        name: search.filename,
        title: `Từ ngày ${moment(search.startedAt).format("DD-MM-YYYY")} đến ngày ${moment(search.endedAt).format("DD-MM-YYYY")} ${titleLength > 1 ? '' : 'cho loại tăng ca ' + title[0]}`,
        customHeaders: headers,
        customKeys: keys,
        data: payrolls,
      },
      200
    );
  }

  exportOvertime(response: Response, search: SearchExportDto, payrolls: any[], totalSalary: any, headers: string[], keys: string[]) {
    const title = [...new Set(payrolls.map(payroll => payroll.title).filter(payroll => payroll !== ""))];
    const titleLength = title.length;
    const total = {
      lastName: "Tổng tiền",
      branch: "",
      position: "",
      datetime: "",
      title: "",
      price: "",
      unit: totalSalary.unit.days + " ngày, " + totalSalary.unit.hours + " giờ",
      total: totalSalary.total,
    };
    payrolls.push(total);
    return exportExcel(
      response,
      {
        name: search.filename,
        title: `Bảng tăng ca từ ngày ${moment(search.startedAt).format("DD-MM-YYYY")} đến ngày ${moment(search.endedAt).format("DD-MM-YYYY")} ${titleLength > 1 ? '' : 'cho loại tăng ca ' + title[0]}`,
        customHeaders: headers,
        customKeys: keys,
        data: payrolls,
      },
      200
    );
  }
}

