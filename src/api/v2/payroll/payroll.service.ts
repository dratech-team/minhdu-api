import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreatePayrollDto} from './dto/create-payroll.dto';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {PrismaService} from "../../../prisma.service";
import {Promise} from "mongoose";
import {Payroll, Salary, SalaryType} from '@prisma/client';
import {UpdateSalaryPayrollDto} from "./dto/update-salary-payroll.dto";

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {
  }

  /**
   * Cập nhật phiếu lương nếu quản lý chưa xác nhận phiếu lương này. Nhận vào id của payroll
   * */
  async updateCreateSalary(id: number, updateSalaryPayrollDto: UpdateSalaryPayrollDto) {
    try {
      return await this.prisma.payroll.update({
        where: {
          id: id
        },
        data: {
          salaries: {
            create: updateSalaryPayrollDto,
          }
        }
      });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async create(body: CreatePayrollDto) {
    try {
      const confirmed = await this.prisma.payroll.findMany({where: {confirmedAt: null}});
      if (confirmed.length > 0) {
        throw new BadRequestException(`Phiếu lương của nhân viên ${body.employeeId} vẫn còn tồn đọng ${confirmed.length} phiếu chưa được quản lý duyệt. Vui lòng xử lý trước khi tạo phiếu lương mới.`);
      }
      return await this.prisma.payroll.create({
        data: {
          employeeId: body.employeeId,
          salaries: {create: body}
        }
      });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e);
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
          skip: skip,
          take: take,
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
      return {
        data,
        statusCode: 200,
        page: (skip / take) + 1,
        total: count,
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number): Promise<{ salaries: Salary[], total: number }> {

    const payroll = await this.prisma.payroll.findUnique({
      where: {id: id},
      include: {
        salaries: true
      }
    });

    const employee = await this.prisma.employee.findUnique({
      where: {id: payroll.employeeId},
      select: {positionId: true, departmentId: true, contractAt: true}
    });

    const workday = await this.prisma.departmentToPosition.findUnique({
      where: {departmentId_positionId: {positionId: employee.positionId, departmentId: employee.departmentId}}
    });
    return this.totalSalary(payroll.salaries, workday.workday, employee.contractAt !== null);
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

  async updateSalary(id: number, updates: UpdateSalaryPayrollDto) {
    return await this.prisma.salary.update({
      where: {id: id},
      data: updates
    });
  }

  remove(id: number) {
    return `This action removes a #${id} payroll`;
  }

  totalSalary(salaries: Salary[], workday: number, isContract: boolean) {
    let _rewards: number = 0;
    let _deductions: number = 0;
    let _overtime: number = 0;

    const _basics = salaries.filter(salary => salary.type === SalaryType.BASIC).map(e => e.price).reduce((a, b) => a + b);

    const _allowance = salaries.filter(salary => salary.type === SalaryType.ALLOWANCE).map(e => e.price).reduce((a, b) => a + b);

    for (let i = 0; i < salaries.length; i++) {
      if(salaries[i].type === SalaryType.ABSENT) {

      }
    }
    // _overtime = salaries.filter(salary => salary.type === SalaryType.DAY).map(e => {
    //   return e.price === null ? _basics / workday * e.times * e.rate : e.price;
    // }).reduce((a, b) => a + b);
    // _overtime += salaries.filter(salary => salary.type === SalaryType.TIME).map(e => {
    //   return e.price === null ? _basics / workday / 8 * e.times * e.rate : e.price;
    // }).reduce((a, b) => a + b);
    //
    // _deductions += salaries.filter(salary => salary.type === SalaryType.ABSENT).map(e => {
    //   return e.price === null ? _basics / workday * e.times * e.rate : e.price;
    // }).reduce((a, b) => a + b);
    //
    // _deductions += salaries.filter(salary => salary.type === SalaryType.LATE).map(e => {
    //   return e.price === null ? _basics / workday / 8 * e.times * e.rate : e.price;
    // }).reduce((a, b) => a + b);
    //
    // _deductions += salaries.filter(salary => salary.type === SalaryType.LATE).map(e => {
    //   return e.price === null ? _basics / workday / 8 * e.times * e.rate : e.price;
    // }).reduce((a, b) => a + b);
    //
    // for (let i = 0; i < salaries.length; i++) {
    //   let hour = ((_basics / workday) / 8) * salaries[i].times;
    //   let day = ((_basics / workday) * salaries[i].rate) * salaries[i].times;
    //
    //   switch (salaries[i].type) {
    //     case SalaryType.BASIC_SALARY:
    //       _basics += salaries[i].price;
    //       if (isContract) {
    //         _deductions += salaries[i].price * 0.115;
    //       }
    //       break;
    //     case SalaryType.BASIC:
    //       _basics += salaries[i].price;
    //       break;
    //     case SalaryType.ALLOWANCE:
    //       _rewards += salaries[i].price;
    //       break;
    //     case SalaryType.DAY:
    //       _rewards += day;
    //       break;
    //     case SalaryType.TIME:
    //       _rewards += hour;
    //       break;
    //     case SalaryType.ABSENT:
    //       _deductions += (_basics / workday) * salaries[i].times;
    //       break;
    //     case SalaryType.LATE:
    //       _deductions += hour;
    //       break;
    //     case SalaryType.LOAN:
    //       _deductions += salaries[i].price;
    //       break;
    //   }
    // }
    console.log(`basic ${_basics}`);
    console.log(`_deductions ${_deductions}`);

    return {
      salaries: salaries,
      total: (_basics + _rewards) - _deductions,
    };
  }
}
