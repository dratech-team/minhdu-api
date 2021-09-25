import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import {
  DatetimeUnit,
  Payroll,
  Role,
  Salary,
  SalaryType,
} from "@prisma/client";
import { exportExcel } from "src/core/services/export.service";
import { ProfileEntity } from "../../../common/entities/profile.entity";
import { lastDayOfMonth } from "../../../utils/datetime.util";
import { EmployeeService } from "../employee/employee.service";
import { CreatePayrollDto } from "./dto/create-payroll.dto";
import { SearchPayrollDto } from "./dto/search-payroll.dto";
import { UpdatePayrollDto } from "./dto/update-payroll.dto";
import { OnePayroll } from "./entities/payroll.entity";
import { PayrollRepository } from "./payroll.repository";
import { Response } from "express";
import * as moment from "moment";
import { SalaryService } from "../salary/salary.service";

@Injectable()
export class PayrollService {
  constructor(
    private readonly repository: PayrollRepository,
    private readonly employeeService: EmployeeService
  ) {}

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
      { branchId: user.branchId }
    );

    ///
    await Promise.all(
      employee.data.map(async (employee) => {
        const payroll = await this.repository.findByEmployeeId(employee.id);

        const lastMonth = moment(new Date())
          .subtract(1, "months")
          .endOf("month")
          .toDate();
        const lastPayroll = await this.repository.findByEmployeeId(
          employee.id,
          lastMonth
        );
        if (!payroll) {
          const payroll = await this.repository.create({
            employeeId: employee.id,
            createdAt: new Date(),
          });
        }
      })
    );
    const data = await this.repository.findAll(user, skip, take, search);
    const payrolls = data.data.map((payroll) =>
      this.mapPayrollToPayslip(payroll)
    );

    return { total: data.total, data: payrolls };
  }

  mapPayrollToPayslip(payroll) {
    return Object.assign(payroll, {
      payslip: payroll.manConfirmedAt ? this.totalSalary(payroll) : null,
    });
  }

  async findOne(id: number): Promise<OnePayroll> {
    const res = await this.repository.findOne(id);
    const a = Object.assign(this.mapPayrollToPayslip(res), {
      actualDay: this.totalSalary(res).actualDay,
    });
    console.log("a", a);
    return a;
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
    if (payroll.isEdit) {
      throw new BadRequestException(
        "Phiếu lương đã được tạo vì vậy bạn không có quyền sửa. Vui lòng liên hệ admin để được hỗ trợ."
      );
    }

    return await this.repository.update(id, updates);
  }

  async confirmPayroll(user: ProfileEntity, id: number) {
    switch (user.role) {
      case Role.CAMP_ACCOUNTING:
        return await this.repository.update(id, { accConfirmedAt: new Date() });
      case Role.CAMP_MANAGER:
        return await this.repository.update(id, { manConfirmedAt: new Date() });
      case Role.ACCOUNTANT_CASH_FUND:
        return await this.repository.update(id, { paidAt: new Date() });
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
    let absent = 0;
    let late = 0;
    const DAY = 1;

    for (let i = 0; i < salaries.length; i++) {
      switch (salaries[i].type) {
        case SalaryType.ABSENT: {
          if (salaries[i].unit === DatetimeUnit.DAY) {
            if (salaries[i].forgot) {
              absent += DAY * 1.5;
            } else {
              absent += DAY;
            }
          } else if (salaries[i].unit === DatetimeUnit.HOUR) {
            absent += Math.floor(DAY / 8);
            late += DAY % 8;
          }
          break;
        }
      }
    }
    console.log("absent", absent, "late", late);
    return { absent, late };
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
   * 1. actual > workday                  => result = (basics / workday) x actual + stays + allowances
   * 2. actual < workday                  => result = [(basics + stays) / workday] x actual + allowances
   * 3. isFlat === true && absents !== 0  => actual = workday (Dù tháng đó có bao nhiêu ngày đi chăng nữa). else quay lại 1 & 2
   * */
  /// TODO: handle holiday
  totalSalary(payroll: OnePayroll): TotalSalary {
    let basicSalary = 0;
    let tax = 0;
    let staySalary = 0;
    let allowanceSalary = 0;
    let overtimeSalary = 0;
    let absentTime = 0;
    let lateTime = this.totalAbsent(payroll.salaries).late;
    let daySalary = 0;
    let total = 0;

    /// TH nhân viên nghỉ ngang. Thì sẽ confirm phiếu lương => phiếu lương không được sửa nữa. và lấy ngày hiện tại
    let actualDay = !payroll.isEdit
      ? new Date().getDate()
      : lastDayOfMonth(payroll.createdAt) -
        this.totalAbsent(payroll.salaries).absent;

    if (
      payroll.employee.isFlatSalary &&
      this.totalAbsent(payroll.salaries).absent === 0 &&
      !payroll.isEdit
    ) {
      actualDay = 30;
    }

    for (let i = 0; i < payroll.salaries.length; i++) {
      switch (payroll.salaries[i].type) {
        case SalaryType.BASIC:
          basicSalary += payroll.salaries[i].price;
          break;
        case SalaryType.STAY:
          staySalary += payroll.salaries[i].price;
          break;
        case SalaryType.ALLOWANCE:
          if (!payroll.salaries[i].times && !payroll.salaries[i].datetime) {
            payroll.salaries[i].times = 1;
          }
          allowanceSalary +=
            payroll.salaries[i].times * payroll.salaries[i].price;
          break;
        case SalaryType.OVERTIME:
          /*
           * Nếu lương x2 thì tính thêm 1 ngày vì ngày hiện tại vẫn đi làm*/
          overtimeSalary +=
            payroll.salaries[i].times * payroll.salaries[i].price;
          break;
        // case SalaryType.ABSENT:
        //   if (payroll.salaries[i].unit === DatetimeUnit.HOUR) {
        //     lateTime += payroll.salaries[i].times;
        //   }
        //   break;
      }
    }
    if (actualDay >= payroll.employee.workday) {
      daySalary = basicSalary / payroll.employee.workday;
    } else {
      daySalary = (basicSalary + staySalary) / payroll.employee.workday;
    }

    const basic = payroll.salaries.find(
      (salary) => salary.type === SalaryType.BASIC_INSURANCE
    );
    if (basic) {
      tax = payroll.employee.contracts.length !== 0 ? basic.price * 0.115 : 0;
    }

    const deduction = (daySalary / 8) * lateTime + daySalary * absentTime;
    const allowanceOvertime = daySalary * overtimeSalary;

    if (actualDay >= payroll.employee.workday) {
      total =
        daySalary * actualDay +
        allowanceSalary +
        allowanceOvertime +
        staySalary -
        tax;
    } else {
      total = daySalary * actualDay + allowanceSalary + allowanceOvertime - tax;
    }
    return {
      basic: Math.ceil(basicSalary),
      stay: Math.ceil(staySalary),
      overtime: overtimeSalary,
      allowance: Math.ceil(allowanceSalary + allowanceOvertime),
      deduction,
      daySalary,
      actualDay: actualDay - this.totalAbsent(payroll.salaries).absent,
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
