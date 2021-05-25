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

  async exportPayroll(id: number) {
    const payroll = await this.prisma.payroll.findUnique({
      where: {id},
      include: {salaries: true}
    });

    const employee = await this.prisma.employee.findUnique({
      where: {id: payroll.employeeId},
      include: {
        branch: true,
        department: true,
        position: true,
      }
    });

    const absent = payroll.salaries
      ?.filter((salary) => salary.type === SalaryType.ABSENT)
      ?.map(e => e.times)
      ?.reduce((a, b) => a + b, 0);

    const absentForgot = payroll.salaries
      ?.filter((salary) => salary.type === SalaryType.ABSENT && salary.forgot)
      ?.map(e => e.times * 0.5)
      ?.reduce((a, b) => a + b, 0);

    const overtime = payroll.salaries
      ?.filter((salary) => salary.type === SalaryType.OVERTIME)
      ?.map(e => e.times * e.rate)
      ?.reduce((a, b) => a + b, 0);

    const workTotal = employee.workday + overtime - absent;

    const daySalary = payroll.salaries
      ?.filter((salary) => workTotal < employee.workday ? salary.type === SalaryType.BASIC || salary.type === SalaryType.ALLOWANCE_STAYED : salary.type === SalaryType.BASIC)
      ?.map(e => e.price)?.reduce((a, b) => a + b, 0) / employee.workday;

    const allowanceSalary = payroll.salaries
      ?.filter((salary) => salary.type === SalaryType.ALLOWANCE_STAYED || salary.type === SalaryType.ALLOWANCE)
      ?.map(e => e.price)?.reduce((a, b) => a + b, 0);

    const basicSalary = payroll.salaries
      ?.filter((salary) => salary.type === SalaryType.BASIC && salary.title === "Lương cơ bản")
      ?.map(e => e.price)?.reduce((a, b) => a + b, 0);

    const late = payroll.salaries
      ?.filter((salary) => salary.type === SalaryType.LATE)
      ?.map(e => daySalary / 8 * e.times)?.reduce((a, b) => a + b, 0);

    const salary = Math.ceil((daySalary * (workTotal - absentForgot) + allowanceSalary) - (employee.contractAt !== null ? basicSalary * 0.115 : 0) - late);

    console.log(`=== Ngày thực tế ${workTotal - absentForgot} ===`);
    console.log(`=== Lương thực nhận theo ngày làm: ${Math.ceil(daySalary * (workTotal - absentForgot) + allowanceSalary)} ===`);
    console.log(`=== Thuế + bảo hiểm: ${employee.contractAt !== null ? basicSalary * 0.115 : 0} ===`);
    console.log(`=== Lương thực nhận: ${salary} ===`);

    return {
      employee: {
        id: employee.id,
        name: employee.name,
        branch: employee.branch,
        department: employee.department,
        position: employee.position,
      },
      payrollId: payroll.id,
      salaries: payroll.salaries,
      status: payroll.paidAt ? 'Đã thanh toán' : 'Chưa thanh toán',
      createdAt: payroll.createdAt,
      day: workTotal - absentForgot,
      salary: Math.ceil(daySalary * (workTotal - absentForgot) + allowanceSalary),
      tax: employee.contractAt !== null ? basicSalary * 0.115 : 0,
      total: salary,
    };
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
