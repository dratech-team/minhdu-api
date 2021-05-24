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

  async findAll() {
    const datetime = moment().format('yyyy-MM');
    let workday: number;
    let actualDay: number;
    let data = [];
    let payroll: any;

    try {
      const [total, employees] = await Promise.all([
        this.prisma.employee.count(),
        this.findEmployee()
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


        actualDay = this.actualDay(employees[i].payrolls);

        data.push({
          id: payroll.id,
          isEdit: payroll.isEdit,
          confirmedAt: payroll.confirmedAt,
          paidAt: payroll.paidAt,
          createdAt: payroll.createdAt,
          salaries: payroll.salaries,
          employee: {
            id: employees[i].id,
            name: employees[i].name,
            isFlatSalary: employees[i].isFlatSalary,
            branch: employees[i].branch,
            department: employees[i].department,
            position: employees[i].position,
            contractAt: employees[i].contractAt,
            workday,
            actualDay
          }
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
        }
      });
      return await this.queryPayroll(payroll);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async update(id: number, updates: UpdatePayrollDto) {
    // let salary: Salary;
    //
    // if (updates.salary) {
    //   if (updates.salary.type === SalaryType.OVERTIME || updates.salary.type === SalaryType.ALLOWANCE && !updates.salary.datetime) {
    //     throw new BadRequestException('Ngày không được để trống.');
    //   } else {
    //     salary = await this.prisma.salary.create({data: updates.salary});
    //   }
    // }

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
    return await this.queryPayroll(payroll);
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

  actualDay(payroll) {
    let actualDay: number = new Date().getDate();

    const absent = payroll?.salaries?.filter(salary => salary.type === SalaryType.ABSENT).map(e => e.times).reduce((a, b) => a + b, 0);
    const late = payroll?.salaries?.filter(salary => salary.type === SalaryType.LATE).map(e => e.times).reduce((a, b) => a + b, 0);

    if (absent > 0) {
      actualDay -= absent;
    }
    if (late > 8) {
      actualDay -= 1;
    }
    return actualDay;
  }


  async findEmployee(id?: string) {
    return await this.prisma.employee.findMany({
      where: id ? {
        id: id
      } : {},
      include: {
        branch: true,
        department: true,
        position: true,
        payrolls: {
          include: {
            salaries: true
          }
        }
      },
    });
  }

  async queryPayroll(payroll) {
    const employees = await this.findEmployee(payroll.employeeId);

    const actualDay = this.actualDay(payroll);

    return {
      id: payroll.id,
      isEdit: payroll.isEdit,
      confirmedAt: payroll.confirmedAt,
      paidAt: payroll.paidAt,
      createdAt: payroll.createdAt,
      salaries: payroll.salaries,
      employee: {
        id: employees[0].id,
        name: employees[0].name,
        isFlatSalary: employees[0].isFlatSalary,
        branch: employees[0].branch,
        department: employees[0].department,
        position: employees[0].position,
        contractAt: employees[0].contractAt,
        workday: employees[0].workday,
        actualDay
      }
    };
  }
}
