import {BadRequestException, Injectable} from '@nestjs/common';
import {CreatePayrollDto} from './dto/create-payroll.dto';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {PrismaService} from "../../../prisma.service";
import {Promise} from "mongoose";
import {Payroll, Salary, SalaryType} from '@prisma/client';
import {SalaryService} from "../salary/salary.service";

@Injectable()
export class PayrollService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly salaryService: SalaryService,
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

  async findAll(employeeId: string, confirmed: boolean, skip: number, take: number) {
    try {
      const [count, data] = await Promise.all([
        this.prisma.payroll.count({
          where: confirmed != null
            ? (
              confirmed ? {
                employeeId: employeeId,
                NOT: {
                  confirmedAt: null
                },
              } : {
                employeeId: employeeId,
                confirmedAt: null
              })
            : {
              employeeId: employeeId,
            }
        }),
        this.prisma.payroll.findMany({
          where: confirmed != null
            ? (
              confirmed ? {
                employeeId: employeeId,
                NOT: {
                  confirmedAt: null
                },
              } : {
                employeeId: employeeId,
                confirmedAt: null
              })
            : {
              employeeId: employeeId,
            }
        }),

      ]);
      return data;
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number): Promise<any> {
    const salaries = await this.prisma.payroll.findUnique({
      where: {id: id},
      include: {
        salaries: true
      }
    });

    console.log(salaries);

    return salaries.salaries;
  }

  async update(id: number, updates: UpdatePayrollDto) {
    let updated: Payroll;
    const confirmed = await this.prisma.payroll.findUnique({where: {id: id}, select: {confirmedAt: true}});

    if (!confirmed.confirmedAt && updates.isConfirm) {
      updated = await this.prisma.payroll.update({
        where: {id: id},
        data: {
          isEdit: !updates.isConfirm,
          confirmedAt: new Date(),
        }
      });
    }
    if (confirmed.confirmedAt && updates.isPaid) {
      updated = await this.prisma.payroll.update({
        where: {id: id},
        data: {
          paidAt: new Date(),
        }
      });
    }
    return updated;
  }

  remove(id: number) {
    return `This action removes a #${id} payroll`;
  }

  totalSalary(
    salaries: Salary[],
    workday: number,
    isContract: boolean,
  ): { day: number, salary: number, tax: number, total: number } {
    const absent = salaries
      ?.filter((salary) => salary.type === SalaryType.ABSENT)
      ?.map(e => e.times)
      ?.reduce((a, b) => a + b, 0);

    const absentForgot = salaries
      ?.filter((salary) => salary.type === SalaryType.ABSENT && salary.forgot)
      ?.map(e => e.times * 0.5)
      ?.reduce((a, b) => a + b, 0);

    const overtime = salaries
      ?.filter((salary) => salary.type === SalaryType.OVERTIME)
      ?.map(e => e.times * e.rate)
      ?.reduce((a, b) => a + b, 0);

    const workTotal = workday + overtime - absent;

    const daySalary = salaries
      ?.filter((salary) => workTotal < workday ? salary.type === SalaryType.BASIC || salary.type === SalaryType.ALLOWANCE_STAYED : salary.type === SalaryType.BASIC)
      ?.map(e => e.price)?.reduce((a, b) => a + b, 0) / workday;

    const allowanceSalary = salaries
      ?.filter((salary) => salary.type === SalaryType.ALLOWANCE_STAYED || salary.type === SalaryType.ALLOWANCE)
      ?.map(e => e.price)?.reduce((a, b) => a + b, 0);

    const basicSalary = salaries
      ?.filter((salary) => salary.type === SalaryType.BASIC && salary.title === "Lương cơ bản")
      ?.map(e => e.price)?.reduce((a, b) => a + b, 0);

    const late = salaries
      ?.filter((salary) => salary.type === SalaryType.LATE)
      ?.map(e => daySalary / 8 * e.times)?.reduce((a, b) => a + b, 0);

    const salary = Math.ceil((daySalary * (workTotal - absentForgot) + allowanceSalary) - (isContract ? basicSalary * 0.115 : 0) - late);

    console.log(`=== Ngày thực tế ${workTotal - absentForgot} ===`);
    console.log(`=== Lương thực nhận theo ngày làm: ${Math.ceil(daySalary * (workTotal - absentForgot) + allowanceSalary)} ===`);
    console.log(`=== Thuế + bảo hiểm: ${isContract ? basicSalary * 0.115 : 0} ===`);
    console.log(`=== Lương thực nhận: ${salary} ===`);

    return {
      day: workTotal - absentForgot,
      salary: Math.ceil(daySalary * (workTotal - absentForgot) + allowanceSalary),
      tax: isContract ? basicSalary * 0.115 : 0,
      total: salary,
    };
  }

  async connectSalaryToPayroll(salaryId: number, employeeId: string) {
    await this.prisma.payroll.create({
      data: {
        employee: {connect: {id: employeeId}},
        salaries: {connect: {id: salaryId}}
      }
    });
  }
}
