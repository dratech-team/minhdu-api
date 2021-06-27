import {BadRequestException, Injectable} from "@nestjs/common";
import {Salary, SalaryType} from "@prisma/client";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {SalaryRepository} from "./salary.repository";
import {EmployeeService} from "../employee/employee.service";
import {PayrollService} from "../payroll/payroll.service";
import {firstMonth, lastMonth} from "../../../utils/datetime.util";

@Injectable()
export class SalaryService {
  constructor(
    private readonly repository: SalaryRepository,
    private readonly employeeService: EmployeeService,
    private readonly payrollService: PayrollService,
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
        if ((body.type === SalaryType.ABSENT ||
          body.type === SalaryType.OVERTIME ||
          body.type === SalaryType.ALLOWANCE
        ) && body.employeeId !== null
        ) {
          throw new BadRequestException('[Development] Các khoản vắng, tăng ca, phụ cấp thêm flexible theo từng tháng. Vui lòng không link với nhân viên. Th gà frontend này');
        }
        const employee = await this.employeeService.findOne(body.employeeId);
        if (employee.salaries.filter(salary => salary.type === SalaryType.BASIC_ISNURANCE).length !== 0) {
          throw new BadRequestException('Nhân viên này đã có lương cơ bản trích bảo hiểm. Vui lòng kiểm tra lại hoặc liên hệ admin để được hỗ trợ!!!');
        }
      }
      return await this.repository.create(body);
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

  async update(id: number, updateSalaryDto: UpdateSalaryDto) {
    try {
      return await this.repository.update(id, updateSalaryDto);
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
