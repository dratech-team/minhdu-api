import {BadRequestException, Injectable} from "@nestjs/common";
import {Salary, SalaryType} from "@prisma/client";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {SalaryRepository} from "./salary.repository";
import {EmployeeService} from "../employee/employee.service";
import {PayrollService} from "../payroll/payroll.service";
import {firstMonth, lastMonth} from "../../../utils/datetime.util";
import {HistorySalaryService} from "../histories/history-salary/history-salary.service";

@Injectable()
export class SalaryService {
  constructor(
    private readonly repository: SalaryRepository,
    private readonly employeeService: EmployeeService,
    private readonly payrollService: PayrollService,
    private readonly hSalaryService: HistorySalaryService,
  ) {
  }

  async create(body: CreateSalaryDto): Promise<Salary> {
    if (body.employeeIds && body.employeeIds.length && body.type === SalaryType.OVERTIME) {
      const employees = await Promise.all(body.employeeIds.map(async (employeeId) => await this.employeeService.findOne(employeeId)));

      for (let i = 0; i < employees.length; i++) {
        // get payroll để lấy thông tin
        const payroll = await this.payrollService.findFirst({
          employeeId: employees[i].id,
          createdAt: {
            gte: firstMonth(body.datetime ?? new Date()),
            lte: lastMonth(body.datetime ?? new Date()),
          }
        });
        // Tạo overtime trong payroll cho nhân viên
        await this.repository.create(Object.assign(body, {payrollId: payroll.id, employeeId: employees[i].id}));
      }
    } else {
      const employee = await this.employeeService.findOne(body.employeeId);
      if (body.type === SalaryType.BASIC && employee.salaries.map(salary => salary.type).includes(SalaryType.BASIC)) {
        throw new BadRequestException(`Lương cơ bản của nhân viên ${employee.firstName + employee.lastName} đã tồn tại. Vui lòng không thêm`);
      }
      return await this.repository.create(body).then((salary) => {
        // Nếu lương là lương cơ bản, bảo hiểm, ở lại thì sẽ update lại lương cho nhân viên đó
        if (
          body.type === SalaryType.BASIC ||
          body.type === SalaryType.BASIC_INSURANCE ||
          body.type === SalaryType.STAY
        ) {
          this.employeeService.update(body.employeeId, {salaryId: salary.id});
        }
        return salary;
      });
    }
  }

  //
  // findAll(employeeId: number, skip: number, take: number, search?: string) {
  //   return this.repository.findAll(employeeId, skip, take, search);
  // }

  findBy(employeeId: number, query: any): Promise<Salary[]> {
    throw new Error("Method not implemented.");
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateSalaryDto) {
    const salary = await this.findOne(id);

    const payroll = await this.payrollService.findOne(salary.payrollId);
    if (payroll.paidAt) {
      throw new BadRequestException("Bảng lương đã thanh toán không được phép sửa");
    }
    return await this.repository.update(id, updates).then(salary => {
      /**
       * Nếu lương update là insnurance / basic / stay thì sẽ cập nhật lịch sử lương của nhân viên đó
       * */
      if (
        salary.type === SalaryType.BASIC_INSURANCE ||
        salary.type === SalaryType.BASIC ||
        salary.type === SalaryType.STAY
      ) {
        this.hSalaryService.create(id, salary.employeeId);
      }
      return salary;
    });
  }

  remove(id: number) {
    return this.repository.remove(id);
  }

  createHistory(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
