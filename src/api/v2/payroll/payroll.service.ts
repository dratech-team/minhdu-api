import {BadRequestException, Injectable} from '@nestjs/common';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {PrismaService} from "../../../prisma.service";
import {Promise} from "mongoose";
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
    let workDay: number;
    let actualDay: number;
    let data = [];


    try {
      let employees = await this.findEmployees();

      for (let i = 0; i < employees.length; i++) {
        /**
         * Tạo payroll của tháng này nếu tháng này chưa có payroll mới
         * */
        employees[i].payrolls.filter(async (employee) => {
          if (!employee.createdAt.toISOString().startsWith(datetime)) {
            employees[i].payrolls.push(await this.create(employees[i].id));
          }
        });


        workDay = (await this.prisma.departmentToPosition.findFirst({
          where: {
            departmentId: employees[i].departmentId,
            positionId: employees[i].positionId
          },
          select: {workday: true}
        })).workday;

        actualDay = this.actualDay(employees[i].payrolls);

        data.push({
          id: employees[i].id,
          name: employees[i].name,
          gender: employees[i].gender,
          birthday: employees[i].birthday,
          phone: employees[i].phone,
          workedAt: employees[i].workedAt,
          leftAt: employees[i].leftAt,
          idCardAt: employees[i].idCardAt,
          address: employees[i].address,
          certificate: employees[i].certificate,
          stayedAt: employees[i].stayedAt,
          contractAt: employees[i].contractAt,
          note: employees[i].note,
          qrcode: employees[i].qrCode,
          isFlatSalary: employees[i].isFlatSalary,
          branch: employees[i].branch,
          department: employees[i].department,
          position: employees[i].position,
          payrolls: employees[i].payrolls,
          workDay,
          actualDay
        });
      }

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

    return salaries.salaries;
  }

  async update(id: number, updates: UpdatePayrollDto) {
    const salary = await this.prisma.salary.create({
      data: {
        title: updates.title,
        price: updates.price,
        type: updates.type,
        times: updates.times,
        rate: updates.rate,
        forgot: updates.forgot,
        note: updates.note,
      }
    });

    return await this.prisma.payroll.update({
      where: {id: id},
      data: {
        isEdit: updates.isConfirm == null,
        paidAt: updates.isPaid ? new Date() : null,
        confirmedAt: updates.isConfirm ? new Date() : null,
        salaries: {connect: {id: salary.id}}
      },
      include: {salaries: true}
    });
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

  async findEmployees() {
    return await this.prisma.employee.findMany({
      include: {
        branch: true,
        department: true,
        position: true,
        payrolls: true
      },
    });
  }
}
