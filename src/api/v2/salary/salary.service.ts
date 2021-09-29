import { BadRequestException, Injectable } from "@nestjs/common";
import { Salary, SalaryType } from "@prisma/client";
import {
  firstDatetimeOfMonth,
  lastDatetimeOfMonth
} from "../../../utils/datetime.util";
import { EmployeeService } from "../employee/employee.service";
import { PayrollService } from "../payroll/payroll.service";
import { CreateSalaryDto } from "./dto/create-salary.dto";
import { UpdateSalaryDto } from "./dto/update-salary.dto";
import { OneSalary } from "./entities/salary.entity";
import { SalaryRepository } from "./salary.repository";

@Injectable()
export class SalaryService {
  constructor(
    private readonly repository: SalaryRepository,
    private readonly employeeService: EmployeeService,
    private readonly payrollService: PayrollService
  ) {}

  async create(body: CreateSalaryDto): Promise<Salary> {
    /// Thêm phụ cấp tăng ca hàng loạt
    if (body.employeeIds && body.employeeIds.length) {
      const employees = await Promise.all(
        body.employeeIds.map(
          async (employeeId) => await this.employeeService.findOne(employeeId)
        )
      );
      for (let i = 0; i < employees.length; i++) {
        // get payroll để lấy thông tin
        const payroll = await this.findPayrollByEmployee(
          employees[i].id,
          body.datetime as Date
        );

        // Tạo overtime trong payroll cho nhân viên
        // Thêm phụ cấp tiền ăn / phụ cấp trong giờ làm  tăng ca hàng loạt
        const salary = Object.assign(
          body,
          body.allowEmpIds.includes(employees[i].id)
            ? { payrollId: payroll.id, allowance: body.allowance }
            : { payrollId: payroll.id }
        );
        await this.repository.create(salary);
      }
      console.log("if 1");
    } else {
      const payroll = await this.payrollService.findOne(body.payrollId);
      const salaries = payroll.salaries.filter(
        (salary) =>
          salary.type === SalaryType.BASIC_INSURANCE ||
          salary.type === SalaryType.BASIC ||
          salary.type === SalaryType.STAY
      );
      const isEqualTitle = salaries
        .map((salary) => salary.title)
        .includes(body.title);
      const isEqualPrice = salaries
        .map((salary) => salary.price)
        .includes(body.price);

      if (isEqualTitle && isEqualPrice) {
        throw new BadRequestException(
          `${body.title} đã tồn tại. Vui lòng không thêm`
        );
      }
      /// get phụ cấp theo range ngày
      // const rageDate = (body as CreateSalaryByDayDto).datetime as RageDate;
      // if (!moment(rageDate?.start).isSame(rageDate?.end)) {
      //   const datetimes = getRange(rageDate?.start, rageDate?.end, "days");
      //   console.log(datetimes);
      // }
      return await this.repository.create(body);
    }
  }

  async findPayrollByEmployee(employeeId: number, datetime?: Date) {
    // get payroll để lấy thông tin
    const payroll = await this.payrollService.findFirst({
      employeeId: employeeId,
      createdAt: {
        gte: firstDatetimeOfMonth(datetime ?? new Date()),
        lte: lastDatetimeOfMonth(datetime ?? new Date()),
      },
    });

    if (!payroll) {
      throw new BadRequestException(
        `Bảng lương tháng ${datetime.getMonth()} của nhân viên ${employeeId} không tồn tại. `
      );
    }
    return payroll;
  }

  //
  // findAll(employeeId: number, skip: number, take: number, search?: string) {
  //   return this.repository.findAll(employeeId, skip, take, search);
  // }

  findBy(employeeId: number, query: any): Promise<Salary[]> {
    throw new Error("Method not implemented.");
  }

  async findOne(id: number): Promise<OneSalary> {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateSalaryDto) {
    const salary = await this.findOne(id);

    if (salary.payroll.paidAt) {
      throw new BadRequestException(
        "Bảng lương đã thanh toán không được phép sửa"
      );
    }

    /// TODO: handle salary history
    // if (salary.type === SalaryType.BASIC || salary.type === SalaryType.STAY || salary.type === SalaryType.BASIC_INSURANCE) {
    //     await this.hSalaryService.create(id, salary.payroll.employeeId);
    // }
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    const salary = await this.findOne(id);
    if (salary.payroll.paidAt) {
      throw new BadRequestException(
        "Bảng lương đã thanh toán không được phép xoá"
      );
    }
    return this.repository.remove(id);
  }
}
