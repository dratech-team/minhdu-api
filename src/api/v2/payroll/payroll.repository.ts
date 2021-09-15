import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {InterfaceRepository} from "../../../common/repository/interface.repository";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {firstMonth, lastMonth} from "../../../utils/datetime.util";
import {searchName} from "../../../utils/search-name.util";
import {SearchPayrollDto} from "./dto/search-payroll.dto";

@Injectable()
export class PayrollRepository implements InterfaceRepository<any> {
  constructor(private readonly prisma: PrismaService) {
  }

  count(query?: any): Promise<number> {
    return Promise.resolve(0);
  }

  async create(body: CreatePayrollDto) {
    try {
      return await this.prisma.payroll.create({
        data: {
          employeeId: body.employeeId,
          createdAt: body.createdAt,
        },
      });
    } catch (err) {
      console.error(err);
      if (err.code === 'P2003') {
        throw new BadRequestException('[DEVELOPMENT] Mã nhân viên không tồn tại ', err);
      }
      throw new BadRequestException(err);
    }
  }

  // @ts-ignore
  async findAll(
    branchId: number,
    skip: number,
    take: number,
    search?: Partial<SearchPayrollDto>,
  ) {
    try {
      const name = searchName(search?.name);

      const [total, payrolls] = await Promise.all([
        this.prisma.payroll.count({where: {employee: {leftAt: null}}}),
        this.prisma.payroll.findMany({
          where: {
            AND: {
              employee: {
                leftAt: null,
                position: {
                  name: {startsWith: search?.position, mode: 'insensitive'},
                  department: {
                    name: {startsWith: search?.department, mode: 'insensitive'},
                    branch: {
                      name: {startsWith: search?.branch, mode: 'insensitive'},
                    }
                  }
                },
                code: {startsWith: search?.code, mode: 'insensitive'},
                AND: {
                  firstName: {startsWith: name?.firstName, mode: 'insensitive'},
                  lastName: {startsWith: name?.lastName, mode: 'insensitive'},
                },
              },
              createdAt: search?.createdAt ? {
                gte: firstMonth(search?.createdAt),
                lte: lastMonth(search?.createdAt),
              } : {},
              manConfirmedAt: search?.isConfirm === 1 ? {
                notIn: null
              } : {
                in: null
              },
              paidAt: search?.isPaid === 1 ? {
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
      return await this.prisma.payroll.update({
        where: {id: id},
        data: {
          isEdit: !!updates.accConfirmedAt,
          accConfirmedAt: updates.accConfirmedAt,
          paidAt: updates.paidAt,
          manConfirmedAt: updates.manConfirmedAt,
        }
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
