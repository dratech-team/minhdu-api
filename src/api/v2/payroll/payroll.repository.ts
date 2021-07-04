import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {InterfaceRepository} from "../../../common/repository/interface.repository";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {firstMonth, lastMonth} from "../../../utils/datetime.util";

@Injectable()
export class PayrollRepository implements InterfaceRepository<any> {
  constructor(private readonly prisma: PrismaService) {
  }

  count(query?: any): Promise<number> {
    return Promise.resolve(0);
  }

  async create(body: CreatePayrollDto) {
    try {
      const payroll = await this.prisma.payroll.create({
        data: {
          employeeId: body.employeeId,
          createdAt: body.createdAt,
        },
      });
      return await this.prisma.payroll.update({
        where: {id: payroll.id},
        data: {
          salaries: {connect: body.salaries.map(e => ({id: e.id}))}
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  // @ts-ignore
  async findAll(
    branchId: number,
    skip: number,
    take: number,
    code: string,
    firstName: string,
    lastName: string,
    branch: string,
    department: string,
    position: string,
    createdAt: Date,
    isConfirm: boolean,
    isPaid: boolean,
  ) {
    try {
      const [total, payrolls] = await Promise.all([
        this.prisma.payroll.count({where: {employee: {leftAt: null}}}),
        this.prisma.payroll.findMany({
          where: {
            AND: {
              employee: {
                leftAt: null,
                position: {
                  name: {startsWith: position, mode: 'insensitive'},
                  department: {
                    name: {startsWith: department, mode: 'insensitive'},
                    branch: {
                      name: {startsWith: branch, mode: 'insensitive'},
                    }
                  }
                },
                code: code,
                AND: {
                  firstName: {startsWith: firstName, mode: 'insensitive'},
                  lastName: {startsWith: lastName, mode: 'insensitive'},
                },
              },
              createdAt: {
                gte: firstMonth(createdAt),
                lte: lastMonth(createdAt),
              },
              manConfirmedAt: isConfirm ? {
                notIn: null
              } : {
                in: null
              },
              paidAt: isPaid ? {
                notIn: null
              } : {
                in: null
              },
            }
          },
          take,
          skip,
          include: {
            salaries: true,
            employee: {
              include: {
                position: {include: {department: {include: {branch: true}}}},
              }
            },
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

  async findBy(query: any): Promise<any[]> {
    try {
      return await this.prisma.payroll.findMany({
        where: query,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findFirst(query: any): Promise<any> {
    try {
      return await this.prisma.payroll.findFirst({
        where: query,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
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
              contracts: true,
              position: {include: {department: {include: {branch: true}}}},
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
      if (!payroll.accConfirmedAt) {
        throw new BadRequestException('Phiếu lương đã được tạo vì vậy bạn không có quyền sửa. Vui lòng liên hệ admin để được hỗ trợ.');
      }
      return await this.prisma.payroll.update({
        where: {id: id},
        data: {
          salaries: updates.salaryId ? {connect: {id: updates.salaryId}} : {},
          accConfirmedAt: updates.accConfirmedAt,
          paidAt: updates.isPaid ? new Date() : null,
          manConfirmedAt: updates.manConfirmedAt ? new Date() : null,
        },
        include: {salaries: true}
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.payroll.delete({where: {id: id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
