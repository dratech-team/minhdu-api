import {BadRequestException, Injectable} from '@nestjs/common';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {PrismaService} from "../../../prisma.service";
import {Salary, SalaryType} from '@prisma/client';
import * as moment from "moment";

@Injectable()
export class PayrollService {
  constructor(
    private readonly prisma: PrismaService,
  ) {
  }

  /**
   * Tạo payroll dùng cho các khoảng khấu trừ / thương tết / phụ cấp khác
   * */
  async create(employeeId: string) {
    try {
      const basic = await this.prisma.employee.findUnique({
        where: {id: employeeId},
        select: {
          salaries: true
        }
      });

      const connect = basic.salaries.map(e => ({
        id: e.id
      }));

      return this.prisma.payroll.create({
        data: {
          employee: {connect: {id: employeeId}},
          salaries: {connect: connect}
        }
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findAll(branchId: string, skip: number, take: number, search?: string) {
    try {
      const checkExist = await this.checkPayrollExist(branchId);
      if (checkExist) {
        const [total, payrolls] = await Promise.all([
          this.prisma.payroll.count({where: {employee: {branchId}}}),
          this.prisma.payroll.findMany({
            where: {employee: {branchId}},
            take, skip,
            include: {
              salaries: true,
              employee: {
                include: {
                  branch: true,
                  department: true,
                  position: true,
                }
              }
            }
          })
        ]);
        return {
          total: total,
          data: payrolls.map(payroll => this.totalSalary(payroll)),
        };
      }
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }

  }

  async print(branchId: string) {
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    try {
      const payrolls = await this.prisma.payroll.findMany({
        where: {
          createdAt: {
            gte: firstDay,
            lte: lastDay,
          },
          employee: {
            branch: {
              id: branchId
            }
          }
        },
        include: {
          salaries: true,
        }
      });
      return await this.totalSalary(payrolls);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const payroll = await this.prisma.payroll.findUnique({
        where: {id: id},
        include: {
          salaries: true,
          employee: {
            include: {
              branch: true,
              department: true,
              position: true,
            }
          }
        }
      });

      return {
        id: payroll.id,
        employeeId: payroll.employeeId,
        isEdit: payroll.isEdit,
        confirmedAt: payroll.confirmedAt,
        paidAt: payroll.paidAt,
        createdAt: payroll.createdAt,
        salaries: payroll.salaries,
        actualDay: this.actualDay(payroll.salaries),
        employee: payroll.employee
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async update(id: number, updates: UpdatePayrollDto) {
    const payroll = await this.prisma.payroll.update({
      where: {id: id},
      data: {
        isEdit: updates.isConfirm == null,
        paidAt: updates.isPaid ? new Date() : null,
        confirmedAt: updates.isConfirm ? new Date() : null,
        salaries: {
          connect: {id: updates.salaryId}
        }
      },
      include: {salaries: true}
    });
    // return await this.queryPayroll(payroll);
  }

  async remove(id: number) {
    return `This action removes a #${id} payroll`;
  }

  actualDay(salaries: Salary[]) {
    return new Date().getDate() - salaries.filter(salary => salary.type === SalaryType.ABSENT)
      .map(e => e.forgot ? e.times * 0.5 : e.times)
      .reduce((a, b) => a + b, 0);
  }

  totalSalary(payroll: any) {
    let basicSalary = 0;
    let staySalary = 0;
    let allowanceSalary = 0;
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
          allowanceSalary += payroll.salaries[i].times * payroll.salaries[i].price;
          break;
        case SalaryType.OVERTIME:
          allowanceSalary += payroll.salaries[i].times * payroll.salaries[i].price * payroll.salaries[i].rate;
          break;
        case SalaryType.ABSENT:
          if (payroll.salaries[i].forgot) {
            absentTime += payroll.salaries[i].times * 0.5;
          }
          absentTime += payroll.salaries[i].times;
          break;
        case SalaryType.LATE:
          lateTime += payroll.salaries[i].times;
          break;
      }
    }

    if (actualDay < payroll.employee.workday) {
      daySalary = (basicSalary + staySalary) / payroll.employee.workday;
    } else {
      daySalary = basicSalary / payroll.employee.workday;
    }

    const tax = payroll.employee.contractAt !== null ? basicSalary * 0.115 : 0;
    const deduction = daySalary / 8 * lateTime + daySalary * absentTime;

    const total = Math.ceil((daySalary * actualDay + allowanceSalary) - (tax + deduction));

    return {
      employee: payroll.employee,
      payrollId: payroll.id,
      basic: basicSalary,
      stay: staySalary,
      allowance: allowanceSalary,
      deduction,
      actualDay,
      total: !payroll.isEdit ? total : 0,
      tax,
    };
  }


  async checkPayrollExist(branchId: string): Promise<boolean> {
    const datetime = moment().format('yyyy-MM');
    try {
      const employees = await this.prisma.employee.findMany({
        where: {branchId},
        include: {payrolls: true}
      });

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
