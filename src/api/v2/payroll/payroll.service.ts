import {BadRequestException, Injectable} from '@nestjs/common';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {Salary, SalaryType} from '@prisma/client';
import * as moment from "moment";
import * as XLSX from "xlsx";
import {PayrollRepository} from "./payroll.repository";
import {EmployeeService} from "../employee/employee.service";
import {SalaryService} from "../salary/salary.service";

@Injectable()
export class PayrollService {
  constructor(
    private readonly repository: PayrollRepository,
    private readonly employeeService: EmployeeService,
    private readonly salaryService: SalaryService,
  ) {
  }

  /**
   * Tạo payroll dùng cho các khoảng khấu trừ / thương tết / phụ cấp khác
   * */
  async create(employeeId: string) {
    const employee = await this.employeeService.findOne(employeeId);
    const salaries = employee.salaries.map(e => ({
      id: e.id
    }));
    return this.repository.create(employeeId, salaries);
  }

  async findAll(branchId: number, skip: number, take: number, search?: string, datetime?: Date) {
    const checkExist = await this.checkPayrollExist(branchId);
    if (checkExist) {
      const payroll = await this.repository.findAll(branchId, skip, take, search, datetime);

      return {
        total: payroll.total,
        data: payroll.data.map((e => {
          return {
            id: e.id,
            isEdit: e.isEdit,
            confirmedAt: e.confirmedAt,
            paidAt: e.paidAt,
            createdAt: e.createdAt,
            salaries: e.salaries,
            employee: e.employee,
            actualDay: this.actualDay(e.salaries),
          };
        })),
      };
    } else {
      return {
        total: 0,
        data: [],
      };
    }
  }

  async findOne(id: number): Promise<any> {
    const payroll = await this.repository.findOne(id);
    if (payroll) {
      return this.totalSalary(payroll);
    }
  }

  async update(id: number, updates: UpdatePayrollDto) {
    const payroll = await this.repository.update(id, updates);
    this.salaryService.findOne(updates.salaryId).then(salary => {
      if (salary.type === SalaryType.BASIC || salary.type === SalaryType.ALLOWANCE_STAYED) {
        this.employeeService.connectSalary(payroll.employeeId, updates.salaryId);
      }
    });
    return payroll;
  }

  async remove(id: number) {
    return `This action removes a #${id} payroll`;
  }

  actualDay(salaries: Salary[]) {
    return new Date().getDate() - salaries?.filter(salary => salary.type === SalaryType.ABSENT)
      .map(e => e.forgot ? e.times * 1.5 : e.times)
      .reduce((a, b) => a + b, 0);
  }

  totalSalary(payroll: any) {
    let basicSalary = 0;
    let staySalary = 0;
    let allowanceSalary = 0;
    let overtime = 0;
    let absentTime = 0;
    let lateTime = 0;
    let daySalary = 0;

    const actualDay = this.actualDay(payroll.salaries);

    for (let i = 0; i < payroll.salaries.length; i++) {
      switch (payroll.salaries[i].type) {
        case SalaryType.BASIC:
          basicSalary += payroll.salaries[i].price;
          break;
        case SalaryType.ALLOWANCE_STAYED:
          staySalary += payroll.salaries[i].price;
          break;
        case SalaryType.ALLOWANCE:
          if (payroll.salaries[i].times === null && payroll.salaries.datetime === null) {
            payroll.salaries[i].times = 1;
          }
          allowanceSalary += payroll.salaries[i].times * payroll.salaries[i].price;
          break;
        case SalaryType.OVERTIME:
          overtime += payroll.salaries[i].rate;
          break;
        // case SalaryType.ABSENT:
        //   if (payroll.salaries[i].forgot) {
        //     absentTime += payroll.salaries[i].times * 1.5;
        //   }
        //   absentTime += payroll.salaries[i].times;
        //   break;
        case SalaryType.LATE:
          lateTime += payroll.salaries[i].times;
          break;
      }
    }

    if (actualDay < payroll.employee.position.workday) {
      daySalary = (basicSalary + staySalary) / payroll.employee.position.workday;
    } else {
      daySalary = basicSalary / payroll.employee.position.workday;
    }

    const tax = payroll.employee.contractAt !== null ? basicSalary * 0.115 : 0;
    const deduction = daySalary / 8 * lateTime + daySalary * absentTime;
    const allowanceOvertime = daySalary * overtime;

    const total = Math.ceil((daySalary * (actualDay + overtime) + allowanceSalary) - tax);

    return {
      id: payroll.id,
      confirmedAt: payroll.confirmedAt,
      paidAt: payroll.paidAt,
      createdAt: payroll.createdAt,
      basic: basicSalary,
      stay: staySalary,
      allowance: allowanceSalary + allowanceOvertime,
      deduction,
      actualDay,
      salaries: payroll.salaries,
      total: !payroll.isEdit ? total : 0,
      tax,
      employee: payroll.employee,
    };
  }

  // async print(branchId: number) {
  //   const date = new Date(), y = date.getFullYear(), m = date.getMonth();
  //   const firstDay = new Date(y, m, 1);
  //   const lastDay = new Date(y, m + 1, 0);
  //   try {
  //     const payrolls = await this.prisma.payroll.findMany({
  //       where: {
  //         createdAt: {
  //           gte: firstDay,
  //           lte: lastDay,
  //         },
  //         employee: {
  //           branch: {
  //             id: branchId
  //           }
  //         }
  //       },
  //       include: {
  //         employee: {
  //           include: {
  //             branch: true,
  //             department: true,
  //             position: true,
  //           }
  //         },
  //         salaries: true,
  //       }
  //     });
  //     const res = payrolls.map(payroll => this.totalSalary(payroll));
  //     return await this.handleExcel(res);
  //   } catch (e) {
  //     console.error(e);
  //     throw new BadRequestException(e);
  //   }
  // }

  async checkPayrollExist(branchId: number): Promise<boolean> {
    const datetime = moment().format('yyyy-MM');
    try {
      const employees = await this.employeeService.findMany(branchId);

      for (let i = 0; i < employees.length; i++) {
        const count = employees[i].payrolls.filter(payroll => {
          const createdAt = moment(payroll.createdAt).format('yyyy-MM');
          return new Date(createdAt).getTime() === new Date(datetime).getTime();
        });

        if (count.length > 1) {
          throw new BadRequestException(`Có gì đó không đúng. Các nhân viên ${employees[i].name} có nhiều hơn 2 phiếu lương trong tháng này`);
        } else if (count.length === 0) {
          await this.create(employees[i].id).then();
        }
        return true;
      }
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }
}

