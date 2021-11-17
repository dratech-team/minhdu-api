import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {EmployeeType, Payroll, Salary, SalaryType} from "@prisma/client";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {PrismaService} from "../../../prisma.service";
import {firstDatetimeOfMonth, lastDatetimeOfMonth} from "../../../utils/datetime.util";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {OnePayroll} from "./entities/payroll.entity";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {CreateSalaryDto} from "../salary/dto/create-salary.dto";
import {SearchOvertimePayrollDto} from "./dto/search-overtime-payroll.dto";
import * as moment from "moment";
import {SearchType} from "./entities/search.type.enum";

@Injectable()
export class PayrollRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreatePayrollDto, salaries?: Salary[]) {
    try {
      /// FIXME: If đầu có thẻ gây tốn performance cao
      const exist = await this.prisma.payroll.findMany({
        where: {
          createdAt: {
            gte: firstDatetimeOfMonth(body.createdAt),
            lte: lastDatetimeOfMonth(body.createdAt),
          },
          employee: {
            id: {in: body.employeeId},
          }
        },
      });
      if (!exist?.length) {
        return await this.prisma.payroll.create({
          data: {
            employee: {connect: {id: body.employeeId}},
            createdAt: body.createdAt,
            salaries: salaries?.length
              ? {
                createMany: {
                  data: salaries.map((salary) => {
                    delete salary.payrollId;
                    delete salary.id;
                    return salary;
                  }),
                },
              }
              : {},
          },
          include: {salaries: true},
        });
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

  async generate(body: CreatePayrollDto) {
    try {
      const payrolls = await this.prisma.payroll.findMany({
        where: {
          employee: {id: {in: body.employeeId}}
        },
        include: {salaries: true},
      });

      // Đã tồn tại phiếu lương
      if (payrolls?.length) {
        for (let i = 0; i < payrolls.length; i++) {
          const salaries = payrolls[i].salaries.filter(
            (salary) =>
              salary.type === SalaryType.BASIC ||
              salary.type === SalaryType.BASIC_INSURANCE ||
              salary.type === SalaryType.STAY
          );
          if (salaries?.length) {
            return await this.create(body, salaries);
          }
        }
      } else {
        // Chưa tòn tại phiếu lương nào
        return await this.create(body);
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
  async generateHoliday(payrollId: Payroll["id"], body: Partial<CreateSalaryDto>[]) {
    try {
      if (!body?.length) {
        return await this.prisma.payroll.update({
          where: {id: payrollId},
          data: {
            salaries: {
              deleteMany: {
                type: SalaryType.HOLIDAY
              },
            }
          }
        });
      }
      return await this.prisma.payroll.update({
        where: {id: payrollId},
        data: {
          salaries: {
            deleteMany: {
              type: SalaryType.HOLIDAY
            },
            createMany: {
              data: body.map(holiday => ({
                title: holiday.title,
                price: holiday?.price,
                type: SalaryType.HOLIDAY,
                datetime: holiday.datetime as Date,
                times: holiday.times,
                rate: holiday.rate,
              }))
            }
          }
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException("Khởi tạo ngày lễ xảy ra lõi. Vui lòng thao tác lại. Nếu không được hãy liên hệ admin. Xin cảm ơn");
    }
  }

  async findAll(
    profile: ProfileEntity,
    skip: number,
    take: number,
    search?: Partial<SearchPayrollDto>
  ): Promise<ResponsePagination<OnePayroll>> {
    try {
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
                id: profile.branches?.length ? {in: profile.branches.map(branch => branch.id)} : {},
                name: {startsWith: search?.branch, mode: "insensitive"},
              },
              lastName: {contains: search?.name, mode: "insensitive"},
              type: search?.employeeType ? {in: search?.employeeType} : {}
            },
            createdAt: {
              gte: firstDatetimeOfMonth(search?.createdAt),
              lte: lastDatetimeOfMonth(search?.createdAt),
            },
            salaries: {
              every: {
                title: {startsWith: search?.salaryTitle, mode: "insensitive"},
                price: search?.salaryPrice || undefined,
                type: search?.salaryType ? {in: search?.salaryType} : {}
              }
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
                id: profile.branches?.length ? {in: profile.branches.map(branch => branch.id)} : {},
                name: {startsWith: search?.branch, mode: "insensitive"},
              },
              lastName: {contains: search?.name, mode: "insensitive"},
              type: search?.employeeType ? {in: search?.employeeType} : {}
            },
            createdAt: {
              gte: firstDatetimeOfMonth(search?.createdAt),
              lte: lastDatetimeOfMonth(search?.createdAt),
            },
            salaries: {
              every: {
                title: {startsWith: search?.salaryTitle, mode: "insensitive"},
                price: search?.salaryPrice || undefined,
                type: search?.salaryType ? {in: search?.salaryType} : {}
              }
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
          orderBy: {
            employee: {
              lastName: "asc"
            }
          }
        }),
      ]);

      return {total, data};
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findFirst(query: any) {
    try {
      return await this.prisma.payroll.findFirst({
        where: query
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
              branch: true,
            },
          },
        },
      });

      if (!payroll) {
        throw new NotFoundException("Phiếu lương không tồn tại");
      }

      const payrolls = await this.findIds(payroll.createdAt, payroll.employee.type);
      return Object.assign(payroll, {payrollIds: payrolls.map(payroll => payroll.id)});
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async update(id: number, updates: UpdatePayrollDto) {
    try {
      // Chỉ xác nhận khi phiếu lương có tồn tại giá trị
      const payroll = await this.findOne(id);
      if (!payroll.salaries.length) {
        throw new BadRequestException(`Không thể xác nhận phiếu lương rỗng`);
      } else {
        const salaries = payroll.salaries.filter(
          (salary) =>
            salary.type === SalaryType.BASIC_INSURANCE || SalaryType.BASIC
        );
        if (!salaries.length) {
          throw new BadRequestException(
            `Không thể xác nhận phiếu lương có lương cơ bản rỗng`
          );
        }
      }

      const employee = await this.prisma.employee.findFirst({
        where: {
          payrolls: {
            some: {id}
          }
        }
      });

      if (moment(updates?.accConfirmedAt || updates?.manConfirmedAt).isBefore(employee.createdAt)) {
        throw new BadRequestException(`Không thể xác nhận phiếu lương trước ngày vào làm. Vui lòng kiểm tra lại.`);
      }

      return await this.prisma.payroll.update({
        where: {id: id},
        data: {
          isEdit: !!updates.accConfirmedAt,
          accConfirmedAt: updates?.accConfirmedAt,
          paidAt: updates.paidAt || undefined,
          manConfirmedAt: updates?.manConfirmedAt || null,
          taxed: updates?.taxed,
        },
        include: {
          employee: {
            include: {
              position: true,
              branch: true,
              contracts: true
            }
          },
          salaries: true,
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

  async findOvertimes(profile: ProfileEntity, search: Partial<SearchOvertimePayrollDto>) {
    if (!(search?.startAt && search?.endAt)) {
      throw new BadRequestException("Vui lòng nhập ngày bắt đầu và ngày kết thúc");
    }

    const employees = await this.prisma.employee.findMany({
      where: {
        branchId: profile?.branches?.length ? {in: profile?.branches.map(branch => branch.id)} : {},
        position: {name: search?.name},
        lastName: search?.type === SearchType.EQUALS
          ? {equals: search?.name, mode: "insensitive"}
          : search?.type === SearchType.START_WITH
            ? {startsWith: search?.name, mode: "insensitive"}
            : {contains: search?.name, mode: "insensitive"},
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        gender: true,
        position: {select: {name: true}},
        branch: {select: {name: true}},
      },
      orderBy: {
        lastName: "asc"
      }
    });

    const payrolls = await Promise.all(employees.map(async employee => {
      const payroll = await this.prisma.payroll.findFirst({
        where: {
          employeeId: employee.id,
          createdAt: {
            gte: firstDatetimeOfMonth(search.startAt),
            lte: lastDatetimeOfMonth(search.endAt),
          }
        }
      });
      if (payroll) {
        return Object.assign(employee, {payrollId: payroll.id});
      }
    }));

    return await Promise.all(payrolls.filter(payroll => payroll).map(async employee => {
      if (employee && employee?.payrollId) {
        const salaries = await this.prisma.salary.findMany({
          where: {
            payrollId: employee.payrollId,
            payroll: {
              employeeId: employee.id,
            },
            type: SalaryType.OVERTIME,
            datetime: {
              gte: moment(search.startAt).startOf("day").toDate(),
              lte: moment(search.endAt).endOf("day").toDate(),
            }
          },
          include: {
            allowance: true
          },
          orderBy: {datetime: "asc"}
        });
        return Object.assign(employee, {salaries});
      }
    }));
  }

  async findIds(createdAt: Date, employeeType?: EmployeeType) {
    try {
      return await this.prisma.payroll.findMany({
        where: {
          employee: {
            type: {equals: employeeType || EmployeeType.FULL_TIME}
          },
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

  async currentPayroll(profile: ProfileEntity, datetime: Date) {
    try {
      // if (!profile?.branches?.length) {
      //   throw new NotFoundException("Không tìm thấy đơn vị hợp lệ cho account này. Vui lòng liên hệ admin để thêm quyền");
      // }
      if (!datetime) {
        throw new BadRequestException("Vui lòng nhập tháng / năm để in phiếu chấm công. Xin cảm ơn!!!");
      }

      const employees = await this.prisma.employee.findMany({
        where: {
          branchId: profile?.branches?.length ? {in: profile?.branches.map(branch => branch.id)} : {},
        }
      });
      return await Promise.all(employees.map(async employee => await this.prisma.payroll.findFirst({
        where: {
          employeeId: employee.id,
          createdAt: {
            gte: firstDatetimeOfMonth(datetime || new Date()),
            lte: lastDatetimeOfMonth(datetime || new Date()),
          }
        },
        include: {
          salaries: true,
          employee: {
            include: {
              position: true
            }
          },
        },
        rejectOnNotFound: true,
      })));
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
