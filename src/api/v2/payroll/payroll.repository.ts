import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";

@Injectable()
export class PayrollRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(employeeId: number, salaries: any[]) {
    try {
      return this.prisma.payroll.create({
        data: {
          employee: {connect: {id: employeeId}},
          salaries: {connect: salaries}
        }
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findAll(branchId: number, skip: number, take: number, search?: string, datetime?: Date) {
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date();
    try {
      const where = {
        AND: [
          {
            employee: {branchId},
          },
          {
            createdAt: {
              gte: firstDay,
              lte: lastDay,
            }
          },
          {
            OR: [
              {
                employeeId: {startsWith: search}
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
        this.prisma.payroll.count(),
        this.prisma.payroll.findMany({
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
