import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {Payroll, SalaryType} from "@prisma/client";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {PrismaService} from "../../../prisma.service";
import {firstDatetimeOfMonth, lastDatetimeOfMonth} from "../../../utils/datetime.util";
import {searchName} from "../../../utils/search-name.util";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {OnePayroll} from "./entities/payroll.entity";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {CreateSalaryDto} from "../salary/dto/create-salary.dto";

@Injectable()
export class PayrollRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreatePayrollDto) {
    try {
      /// FIXME: If đầu có thẻ gây tốn performance cao
      const exist = await this.prisma.payroll.findMany({
        where: {
          createdAt: {
            gte: firstDatetimeOfMonth(body.createdAt),
            lte: lastDatetimeOfMonth(body.createdAt),
          },
          employee: {id: {in: body.employeeId}}
        },
      });
      // Khoông được check tồn tại bởi vì tạo nhiều phiếu lương cho nhiều nhân viên thì nhân viên nào được tạo rồi sẽ được bỏ qua
      if (!exist?.length) {
        const payrolls = await this.prisma.payroll.findMany({
          where: {
            employee: {id: {in: body.employeeId}}
          },
          include: {salaries: true},
        });
        // Đã tồn tại phiếu lương
        if (payrolls && payrolls.length) {
          for (let i = 0; i < payrolls.length; i++) {
            const salaries = payrolls[i].salaries.filter(salary => salary.type === SalaryType.BASIC || salary.type === SalaryType.BASIC_INSURANCE || salary.type === SalaryType.STAY);
            if (salaries?.length) {
              return await this.prisma.payroll.create({
                data: {
                  employee: {connect: {id: body.employeeId}},
                  createdAt: body.createdAt,
                  salaries: {
                    createMany: {
                      data: salaries.map(salary => {
                        delete salary.payrollId;
                        delete salary.id;
                        return salary;
                      })
                    }
                  }
                }
              });
            }
          }
        } else {
          // Chưa tòn tại phiếu lương nào
          await this.prisma.payroll.create({
            data: body,
            include: {salaries: true},
          });
        }
      }
    } catch (err) {
      console.error(err);
      if (err.code === "P2003") {
        throw new BadRequestException(
          "[DEVELOPMENT] Mã nhân viên không tồn tại ",
          err
        );
      }
      throw new BadRequestException(err);
    }
  }

  /// tạo ngày lễ cho phiếu lương đó
  async generate(payrollId: Payroll["id"], body: Partial<CreateSalaryDto>) {
    try {
      return await this.prisma.payroll.update({
        where: {id: payrollId},
        data: {
          salaries: {
            deleteMany: {
              type: SalaryType.HOLIDAY
            },
            create: {
              title: body.title,
              price: body?.price,
              type: SalaryType.HOLIDAY,
              datetime: body.datetime as Date,
              times: body.times,
              rate: body.rate,
              note: "",
            }
          }
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException("Khởi tạo ngày lễ xảy ra lõi. Vui lòng thao tác lại. Nếu không được hãy liên hệ admin. Xin cảm ơn");
    }
  }

  // @ts-ignore
  async findAll(
    user: ProfileEntity,
    skip: number,
    take: number,
    search?: Partial<SearchPayrollDto>
  ): Promise<ResponsePagination<OnePayroll>> {
    try {
      const name = searchName(search?.name);
      const [total, data] = await Promise.all([
        this.prisma.payroll.count({
          where: {
            employeeId: search?.employeeId || undefined,
            employee: {
              leftAt: null,
              position: {
                name: {startsWith: search?.position, mode: "insensitive"},
              },
              branch: {
                name: {startsWith: search?.branch, mode: "insensitive"},
              },
              AND: {
                firstName: {startsWith: name?.firstName, mode: "insensitive"},
                lastName: {startsWith: name?.lastName, mode: "insensitive"},
              },
            },
            createdAt: {
              gte: firstDatetimeOfMonth(search?.createdAt),
              lte: lastDatetimeOfMonth(search?.createdAt),
            },
            paidAt: null,
          },
        }),
        this.prisma.payroll.findMany({
          take: take || undefined,
          skip: skip || undefined,
          where: {
            employeeId: search?.employeeId || undefined,
            employee: {
              leftAt: null,
              position: {
                name: {startsWith: search?.position, mode: "insensitive"},
              },
              branch: {
                name: {startsWith: search?.branch, mode: "insensitive"},
              },
              AND: {
                firstName: {startsWith: name?.firstName, mode: "insensitive"},
                lastName: {startsWith: name?.lastName, mode: "insensitive"},
              },
            },
            createdAt: {
              gte: firstDatetimeOfMonth(search?.createdAt),
              lte: lastDatetimeOfMonth(search?.createdAt),
            },
            paidAt: null,
          },
          include: {
            salaries: true,
            employee: {
              include: {
                contracts: true,
                position: true,
                branch: true,
              },
            },
          },
        }),
      ]);

      return {total, data};
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findFirst(query: any): Promise<Payroll> {
    try {
      return await this.prisma.payroll.findFirst({
        where: query,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number): Promise<OnePayroll & { payrollIds: Payroll["id"][] }> {
    try {
      const payroll = await this.prisma.payroll.findUnique({
        where: {id: id},
        include: {
          salaries: {
            include: {
              allowance: true
            }
          },
          employee: {
            include: {
              contracts: true,
              position: true,
            },
          },
        },
      });

      if (!payroll) {
        throw new NotFoundException("Phiếu lương không tồn tại");
      }

      const payrolls = await this.findIds(payroll.createdAt);
      return Object.assign(payroll, {payrollIds: payrolls.map(payroll => payroll.id)});
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findIds(createdAt: Date) {
    try {
      return await this.prisma.payroll.findMany({
        where: {
          createdAt: {
            gte: firstDatetimeOfMonth(createdAt),
            lte: lastDatetimeOfMonth(createdAt),
          }
        },
        select: {id: true}
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
          accConfirmedAt: updates.accConfirmedAt || undefined,
          paidAt: updates.paidAt || undefined,
          manConfirmedAt: updates.manConfirmedAt || undefined,
        },
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
