import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {Salary} from "@prisma/client";
import {firstMonth, lastMonth} from "../../../utils/datetime.util";

@Injectable()
export class PayrollRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(employeeId: number, salaries: Salary[], createdAt: Date) {
    try {
      const payroll = await this.prisma.payroll.create({
        data: {
          employeeId: employeeId,
          createdAt: createdAt,
        },
      });
      await this.prisma.payroll.update({
        where: {id: payroll.id},
        data: {
          salaries: {connect: salaries.map(e => ({id: e.id}))}
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(branchId: number, skip: number, take: number, search?: string, datetime?: Date) {
    try {
      const where = {
        AND: [
          {
            employee: {branchId, leftAt: null},
          },
          {
            createdAt: {
              gte: firstMonth(new Date()),
              lte: lastMonth(new Date()),
            }
          },
          {
            OR: [
              {
                employee: {
                  code: {startsWith: search}
                }
              },
              {
                employee: {
                  branch: {
                    name: {startsWith: search}
                  }
                }
              },
            ]
          }
        ],
      };
      const [total, payrolls] = await Promise.all([
        this.prisma.payroll.count({where}),
        this.prisma.payroll.findMany({
          where, take, skip,
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
        total,
        data: payrolls,
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      return await this.prisma.payroll.findUnique({
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
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findMany(query: any) {
    try {
      return await this.prisma.payroll.findFirst({
        where: {
          employeeId: query.employeeId,
          createdAt: {
            gte: query.first,
            lte: query.last,
          }
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }

  }

  async update(id: number, updates: UpdatePayrollDto) {
    try {
      const payroll = await this.prisma.payroll.findUnique({where: {id}});
      if (!payroll.isEdit) {
        throw new BadRequestException('Phiếu lương đã được tạo vì vậy bạn không có quyền sửa. Vui lòng liên hệ admin để được hỗ trợ.');
      }
      return await this.prisma.payroll.update({
        where: {id: id},
        data: {
          salaries: updates.salaryId ? {connect: {id: updates.salaryId}} : {},
          isEdit: updates.isEdit,
          paidAt: updates.isPaid ? new Date() : null,
          confirmedAt: updates.isConfirm ? new Date() : null,
        },
        include: {salaries: true}
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }
}
