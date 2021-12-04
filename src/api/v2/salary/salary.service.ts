import {BadRequestException, Injectable} from "@nestjs/common";
import {Salary, SalaryType} from "@prisma/client";
import {firstDatetimeOfMonth, lastDatetimeOfMonth, rangeDatetime} from "../../../utils/datetime.util";
import {EmployeeService} from "../employee/employee.service";
import {PayrollService} from "../payroll/payroll.service";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {OneSalary} from "./entities/salary.entity";
import {SalaryRepository} from "./salary.repository";
import {SearchSalaryDto} from "./dto/search-salary.dto";
import {CreateForEmployeesDto} from "./dto/create-for-employees.dto";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {UpdateManySalaryDto} from "./dto/update-many-salary.dto";
import {isEqualDatetime} from "../../../common/utils/isEqual-datetime.util";

@Injectable()
export class SalaryService {
  constructor(
    private readonly repository: SalaryRepository,
    private readonly employeeService: EmployeeService,
    private readonly payrollService: PayrollService
  ) {
  }

  async create(body: CreateSalaryDto): Promise<Salary | any> {
    const employees: string[] = [];
    const allowances: string[] = [];

    /// Thêm phụ cấp tăng ca hàng loạt
    if (body.employeeIds && body.employeeIds.length) {
      // get all payroll in body.datetime for employee
      const payrolls = await Promise.all(
        body.employeeIds.map(async (employeeId) => {
          return await this.findPayrollByEmployee(employeeId, body.datetime as Date);
        })
      );

      if (payrolls.length !== body.employeeIds.length) {
        throw new BadRequestException(`Có nhân viên nào đó chưa có bảng lương trong tháng ${body.datetime}. Vui lòng kiểm tra lại.`);
      }

      for (let i = 0; i < payrolls.length; i++) {
        // Tạo overtime / absent trong payroll cho nhân viên
        //  Nếu body.allowEmpIds thì Thêm phụ cấp tiền ăn / phụ cấp trong giờ làm  tăng ca hàng loạt.  vì allowance đi chung với body nên cần dặt lại giá trị là null để nó khỏi gán cho nhân viên khác
        // copy obj body nếu k {} thì nó sẽ khi đè lên bên trong thuộc tính body và làm thay đổi giá trị body
        const salary = Object.assign({},
          body, {
            payrollId: payrolls[i].id,
            allowance: body?.allowEmpIds?.includes(payrolls[i].employeeId) && body.type === SalaryType.OVERTIME ? body?.allowance : null,
          }
        );

        const created = await this.repository.create(salary);
        if (created) {
          employees.push(created.payroll.employee.firstName + " " + created.payroll.employee.lastName);
        }
        if (created.allowance) {
          allowances.push(created.allowance?.title);
        }
      }
      return {
        status: 201,
        message: `Đã thêm ${body.title} cho ${employees.length} nhân viên. ${body.type === SalaryType.OVERTIME ? `Và ${allowances.length} phụ cấp` : ''}`
      };
    } else if (body.startedAt && body.endedAt && !body.datetime) {
      const range = rangeDatetime(body.startedAt, body.endedAt);
      for (let i = 0; i < range.length; i++) {
        await this.repository.create(Object.assign(body, {times: 1, datetime: new Date(range[i].toDate())}));
      }
    } else {
      const created = await this.repository.create(body);
      return await this.payrollService.findOne(created.payrollId);
    }
  }

  async findPayrollByEmployee(employeeId: number, datetime: Date) {
    // get payroll để lấy thông tin
    const payroll = await this.payrollService.findFirst({
      employeeId: employeeId,
      createdAt: {
        gte: firstDatetimeOfMonth(datetime),
        lte: lastDatetimeOfMonth(datetime),
      },
    });
    if (!payroll) {
      throw new BadRequestException(
        `Bảng lương tháng ${firstDatetimeOfMonth(datetime)} của mã nhân viên ${employeeId} không tồn tại. `
      );
    }
    return payroll;
  }

  async findOne(id: number): Promise<OneSalary> {
    return await this.repository.findOne(id);
  }

  async findAll(search: Partial<SearchSalaryDto>) {
    return await this.repository.findAll(search);
  }

  async update(id: number, updates: UpdateSalaryDto) {
    const updated = await this.repository.update(id, updates);
    return await this.payrollService.findOne(updated.payrollId);
  }

  async updateMany(profile: ProfileEntity, id: number, updates: UpdateManySalaryDto) {
    const updated = [];
    const updatedDatetime = [];

    for (let i = 0; i < updates.salaryIds.length; i++) {
      const salary = await this.findOne(updates.salaryIds[i]);
      if (!isEqualDatetime(salary.datetime, salary.payroll.createdAt, "month")) {
        updatedDatetime.push(await this.repository.changeDatetime(updates.salaryIds[i], updates));
      } else {
        updated.push(await this.update(updates.salaryIds[i], updates));
      }
    }
    if (updatedDatetime.length) {
      return {
        status: 201,
        message: `Đã update cho ${updatedDatetime.length} trường đối tháng.`,
      };
    }
    return {
      status: 201,
      message: `Đã update cho ${updated.length} trường`,
    };
  }

  async remove(id: number) {
    const removed = await this.repository.remove(id);
    return await this.payrollService.findOne(removed.payrollId);
  }

  // Dùng 1 lần xong xoá
  async createForEmployees(profile: ProfileEntity, body: CreateForEmployeesDto) {
    const added = [];
    const employees = await this.repository.findEmployees(profile, body);
    const data = employees.reduce((previousValue, currentValue) => {
      if (currentValue.payrolls.length === 1) {
        return [...previousValue, currentValue];
      }
      return previousValue;
    }, []);
    for (let i = 0; i < data.length; i++) {
      const salary = await this.repository.createEmp(Object.assign(body.salary, {payrollId: data[i].payrolls[0].id}));
      added.push(salary);
    }
    return {
      status: 201,
      message: `Đã thêm lương ${body.salary.title} với giá là ${body.salary.price} cho ${added.length} phiếu lương`,
    };
  }
}
