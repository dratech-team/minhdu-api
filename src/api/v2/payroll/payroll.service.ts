import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreatePayrollDto} from './dto/create-payroll.dto';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {PrismaService} from "../../../prisma.service";
import {Promise} from "mongoose";
import {Payroll} from '@prisma/client';
import {UpdateSalaryPayrollDto} from "./dto/update-salary-payroll.dto";

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreatePayrollDto) {
    try {
      return await this.prisma.payroll.create({
        data: {
          employeeId: body.employeeId,
          salaries: {
            create: {
              title: body.title,
              type: body.type,
              price: body.price,
              rate: body.rate,
              times: body.times,
              note: body.note
            }
          }
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

  findOne(id: number) {
    return `This action returns a #${id} payroll`;
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
}
