import {BadRequestException, Injectable} from '@nestjs/common';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {PrismaService} from "../../../prisma.service";
import {SalaryType} from '@prisma/client';
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
    const datetime = moment().format('yyyy-MM');
    let data = [];
    let payroll: any;

    try {
      const [total, employees] = await Promise.all([
        this.prisma.employee.count({where: {branchId}}),
        this.prisma.employee.findMany({
          where: {branchId},
          take, skip,
          include: {payrolls: {include: {salaries: true}}, branch: true, department: true, position: true}
        })
      ]);

      for (let i = 0; i < employees.length; i++) {
        /**
         * - Nếu nhân viên nào có nhiều hơn 1 phiếu lương trong tháng này thì sẽ  hiện ra lỗi. xoá bớt 1 phiếu lương đi
         * - Nếu nhân viên không tồn tại phiếu lương trong tháng này thì tự dộng tạo phiêu lương mới
         * */

        const count = employees[i].payrolls.filter(payroll => {
          const createdAt = moment(payroll.createdAt).format('yyyy-MM');
          return new Date(createdAt).getTime() === new Date(datetime).getTime();
        });

        switch (count.length) {
          case 0:
            payroll = await this.create(employees[i].id).then();
            break;
          case 1:
            payroll = employees[i].payrolls[0];
            break;
          default:
            throw new BadRequestException(`Có gì đó không đúng. Các nhân viên ${employees[i].name} có nhiều hơn 2 phiếu lương trong tháng này`);
        }

        const actualDay = this.actualDay(employees[i].payrolls);
        console.log(actualDay);
        data.push({
          id: payroll.id,
          employeeId: payroll.employeeId,
          isEdit: payroll.isEdit,
          confirmedAt: payroll.confirmedAt,
          paidAt: payroll.paidAt,
          createdAt: payroll.createdAt,
          salaries: payroll.salaries,
          actualDay,
          employee: employees[i]
        });
      }
      return {total, data};

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
      return await this.exportPayroll(payrolls);
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

      const actualDay = this.actualDay(payroll);

      return {
        id: payroll.id,
        employeeId: payroll.employeeId,
        isEdit: payroll.isEdit,
        confirmedAt: payroll.confirmedAt,
        paidAt: payroll.paidAt,
        createdAt: payroll.createdAt,
        salaries: payroll.salaries,
        actualDay: actualDay,
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

  async exportPayroll(payroll: any) {
    let employees = [];
    let absent = 0;
    let absentForgot = 0;
    let overtime = 0;
    let basicSalary = 0;
    let allowanceSalary = 0;
    let workTotal = 0;

    for (let i = 0; i < payroll.length; i++) {
      const employee = await this.prisma.employee.findUnique({
        where: {id: payroll[i].employeeId},
        include: {
          branch: true,
          department: true,
          position: true,
        }
      });

      for (let j = 0; j < payroll[i].salaries.length; j++) {
        if (payroll[i].salaries[j].type === SalaryType.ABSENT) {
          absent += payroll[i].salaries[j].times;
        } else if (payroll[i].salaries[j].type === SalaryType.ABSENT && payroll[i].salaries[j].forgot) {
          absentForgot += payroll[i].salaries[j].times * 0.5;
        } else if (payroll[i].salaries[j].type === SalaryType.OVERTIME) {
          overtime += payroll[i].salaries[j].times * payroll[i].salaries[i].rate;
        } else if (payroll[i].salaries[j].type === SalaryType.ALLOWANCE_STAYED || payroll[i].salaries[j].type === SalaryType.ALLOWANCE) {
          allowanceSalary += payroll[i].salaries[j].price;
        } else if (payroll[i].salaries[j].type === SalaryType.BASIC && payroll[i].salaries[j].title === "Lương cơ bản") {
          allowanceSalary += payroll[i].salaries[j].price;
        } else if (payroll[i].salaries[j].type === SalaryType.LATE) {
          allowanceSalary += payroll[i].salaries[j].price;
        }
      }

      workTotal = employee.position.workday + overtime - absent;

      const daySalary = payroll[i].salaries
        .filter((salary) => workTotal < employee.position.workday ? salary.type === SalaryType.BASIC || salary.type === SalaryType.ALLOWANCE_STAYED : salary.type === SalaryType.BASIC)
        .map(e => e.price)?.reduce((a, b) => a + b, 0) / employee.position.workday;

      const late = payroll[i].salaries
        .filter((salary) => salary.type === SalaryType.LATE)
        .map(e => daySalary / 8 * e.times)?.reduce((a, b) => a + b, 0);

      const salary = Math.ceil((daySalary * (workTotal - absentForgot) + allowanceSalary) - (employee.contractAt !== null ? basicSalary * 0.115 : 0) - late);

      console.log(`=== Ngày thực tế ${workTotal - absentForgot} ===`);
      console.log(`=== Lương thực nhận theo ngày làm: ${Math.ceil(daySalary * (workTotal - absentForgot) + allowanceSalary)} ===`);
      console.log(`=== Thuế + bảo hiểm: ${employee.contractAt !== null ? basicSalary * 0.115 : 0} ===`);
      console.log(`=== Lương thực nhận: ${salary} ===`);

      employees.push({
        employee: {
          id: employee.id,
          name: employee.name,
          position: employee.position,
          note: employee.note,
        },
        payrollId: payroll[i].id,
        basics: payroll[i].salaries.filter(salary => salary.type === SalaryType.BASIC),
        stays: payroll[i].salaries.filter(salary => salary.type === SalaryType.ALLOWANCE_STAYED),
        allowances: payroll[i].salaries.filter(salary => salary.type === SalaryType.ALLOWANCE || salary.type === SalaryType.OVERTIME),
        deductions: payroll[i].salaries.filter(salary => salary.type === SalaryType.ABSENT || salary.type === SalaryType.LATE),
        createdAt: payroll[i].createdAt,
        day: workTotal - absentForgot,
        salary: Math.ceil(daySalary * (workTotal - absentForgot) + allowanceSalary),
        tax: employee.contractAt !== null ? basicSalary * 0.115 : 0,
        total: salary,
      });
    }

    return employees;
  }


  actualDay(payroll) {
    let actualDay: number = new Date().getDate();

    const absent = payroll?.salaries?.filter(salary => salary.type === SalaryType.ABSENT).map(e => e.times).reduce((a, b) => a + b, 0);
    const late = payroll?.salaries?.filter(salary => salary.type === SalaryType.LATE).map(e => e.times).reduce((a, b) => a + b, 0);

    if (absent > 0) {
      actualDay -= absent;
    }
    if (late === 4) {
      actualDay -= 0.5;
    }
    return actualDay;
  }
}
