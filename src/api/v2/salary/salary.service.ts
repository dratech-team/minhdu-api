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
    try {
      if (body.employeeIds && body.employeeIds.length) {
        if (body.type === SalaryType.OVERTIME) {
          body.employeeIds.forEach(id => {
            this.employeeService.findOne(id).then(employee => {
              this.payrollService.findFirst({
                employeeId: employee.id,
                createdAt: {
                  gte: firstMonth(body.datetime ?? new Date()),
                  lte: lastMonth(body.datetime ?? new Date()),
                }
              }).then(payroll => {
                this.repository.create({
                  payrollId: payroll.id,
                  type: body.type,
                  note: body.note,
                  price: body.price,
                  title: body.title,
                  employeeId: employee.id,
                  datetime: body.datetime,
                  times: body.times,
                  forgot: body.forgot,
                  rate: body.rate,
                  unit: body.unit,
                });
              });
            });
          });
        } else {
          throw new BadRequestException('Chức năng này chỉ được sử dụng để thêm công tăng ca. Vui lòng liên hệ admin');
        }
      } else {
        if (
          body.type === SalaryType.BASIC ||
          body.type === SalaryType.BASIC_INSNURANCE ||
          body.type === SalaryType.STAY
        ) {
          const salary = await this.repository.create(body);
          this.employeeService.update(body.payrollId, {salaryId: salary.id}).then();
          return salary;
        } else {
          return await this.repository.create(body);
        }
      }
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
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
    try {
      const salary = await this.findOne(id);
      if (
        salary.type === SalaryType.BASIC_INSNURANCE ||
        salary.type === SalaryType.BASIC ||
        salary.type === SalaryType.STAY
      ) {
        const res = await this.repository.create({
          payrollId: salary.payroll.id,
          type: updates.type ?? salary.type,
          note: updates.note ?? salary.note,
          price: updates.price ?? salary.price,
          title: updates.title ?? salary.title,
          employeeId: salary.employeeId,
        });
        this.hSalaryService.create(res.id, salary.employeeId).then();
        this.repository.disconnect(id).then();
        return res;
      } else {
        return await this.repository.update(id, updates);
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  remove(id: number) {
    return this.repository.remove(id);
  }

  createHistory(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
