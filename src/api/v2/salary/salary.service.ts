import {BadRequestException, Injectable} from "@nestjs/common";
import {Salary, SalaryType} from "@prisma/client";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {SalaryRepository} from "./salary.repository";
import {EmployeeService} from "../employee/employee.service";
import {PayrollService} from "../payroll/payroll.service";
import {firstMonth, lastMonth} from "../../../utils/datetime.util";
import {HistorySalaryService} from "../history-salary/history-salary.service";

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
      if (body.employeeIds.length > 0) {
        if (
          body.type === SalaryType.BASIC_ISNURANCE ||
          body.type === SalaryType.BASIC ||
          body.type === SalaryType.STAY ||
          body.type === SalaryType.ALLOWANCE ||
          body.type === SalaryType.ABSENT
        ) {
          throw new BadRequestException('Chức năng này chỉ được sử dụng để thêm công tăng ca. Vui lòng liên hệ admin');
        }
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
        if (
          body.type === SalaryType.BASIC ||
          body.type === SalaryType.BASIC_ISNURANCE ||
          body.type === SalaryType.STAY
        ) {
          this.findOne(body.payrollId).then(payroll => {
            this.employeeService.update(payroll.employeeId, {
                salary: {
                  title: body.title,
                  type: body.type,
                  price: body.price,
                  note: body.note,
                }
              }
            );
          });
        }
        return await this.repository.create(body);
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
    return this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateSalaryDto) {
    try {
      return this.findOne(id).then(async salary => {
        if (
          salary.type === SalaryType.BASIC_ISNURANCE ||
          salary.type === SalaryType.BASIC ||
          salary.type === SalaryType.STAY
        ) {
          return await this.repository.create({
            payrollId: salary.payroll.id,
            type: updates.type,
            note: updates.note,
            price: updates.price,
            title: updates.title,
            employeeId: salary.employeeId,
          }).then(_ => {
            this.hSalaryService.create(salary.id, salary.employeeId);
            this.repository.disconnect(id).then();
          });
        } else {
          return await this.repository.update(id, updates);
        }
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    await this.repository.remove(id);
  }

  createHistory(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
