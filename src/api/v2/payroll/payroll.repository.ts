import {BadRequestException, Injectable} from "@nestjs/common";
import {Employee, Payroll, SalaryType} from "@prisma/client";
import * as moment from "moment";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {PrismaService} from "../../../prisma.service";
import {firstDatetimeOfMonth, lastDatetimeOfMonth} from "../../../utils/datetime.util";
import {searchName} from "../../../utils/search-name.util";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {FullPayroll, OnePayroll} from "./entities/payroll.entity";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {CreateSalaryDto} from "../salary/dto/create-salary.dto";

@Injectable()
export class PayrollRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreatePayrollDto) {
    try {
      const currentPayroll = await this.prisma.payroll
        .create({
          data: body,
          include: {salaries: true},
        });

      // get tháng trước
      const lastMonth = moment(new Date())
        .subtract(1, "months")
        .endOf("month")
        .toDate();

      // get payroll của tháng trước để lấy lương cơ bản, bảo hiểm, ở lại
      const lastPayroll = await this.findByEmployeeId(currentPayroll.employeeId, lastMonth);

      if (lastPayroll) {
        // filter payroll của tháng trước để lấy lương cơ bản, bảo hiểm, ở lại
        const lastSalaries = lastPayroll.salaries.filter((salary) => {
          return (
            salary.type === SalaryType.BASIC ||
            salary.type === SalaryType.BASIC_INSURANCE ||
            salary.type === SalaryType.STAY
          );
        }).map(salary => {
          delete salary.id;
          salary.payrollId = currentPayroll.id;
          return salary;
        });
        // tự thêm các khoản lương cơ bản và ở lại vào tháng này
        if (lastSalaries.length) {
          await this.prisma.salary.createMany({data: lastSalaries});
        }
      }
      return currentPayroll;
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

  async findByEmployeeId(
    employeeId: Employee["id"],
    datetime?: Date
  ): Promise<FullPayroll> {
    const first = firstDatetimeOfMonth(datetime || new Date());
    const last = lastDatetimeOfMonth(datetime || new Date());
    try {
      return await this.prisma.payroll.findFirst({
        where: {
          createdAt: {
            gte: first,
            lte: last,
          },
          employeeId: employeeId,
        },
        include: {salaries: true},
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
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

      const payrolls = await this.prisma.payroll.findMany({
        where: {
          createdAt: {
            gte: firstDatetimeOfMonth(payroll.createdAt),
            lte: lastDatetimeOfMonth(payroll.createdAt),
          }
        }
      });
      const payrollIds = payrolls.map(payroll => payroll.id);
      return Object.assign(payroll, {payrollIds: payrollIds});
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async find(query: any) {
    try {
      return await this.prisma.payroll.findFirst({
        where: {
          employeeId: query.employeeId,
          createdAt: {
            gte: query.first,
            lte: query.last,
          },
        },
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
