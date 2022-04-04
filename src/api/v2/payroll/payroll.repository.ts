import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {Branch, EmployeeType, Payroll, Position, RecipeType, RoleEnum, SalaryType} from "@prisma/client";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {PrismaService} from "../../../prisma.service";
import {firstDatetime, lastDatetime} from "../../../utils/datetime.util";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {CreateSalaryDto} from "../salary/dto/create-salary.dto";
import * as moment from "moment";
import {Promise} from "es6-promise";
import {FilterTypeEnum} from "./entities/filter-type.enum";
import {SearchSalaryDto} from "./dto/search-salary.dto";
import {OrderbyEmployeeEnum} from "../employee/enums/orderby-employee.enum";
import *as _ from "lodash";
import {TAX} from "../../../common/constant/salary.constant";

@Injectable()
export class PayrollRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreatePayrollDto & { branch: Branch, position: Position, recipeType: RecipeType, workday: number }, isInit?: boolean) {
    try {
      const payrolls = await this.prisma.payroll.findMany({
        where: {
          employee: {id: {in: body.employeeId}},
          deletedAt: {in: null},
          salaries: {
            some: {
              type: {in: [SalaryType.BASIC, SalaryType.BASIC_INSURANCE, SalaryType.STAY]}
            },
          }
        },
        include: {salaries: true},
        orderBy: {
          createdAt: "desc"
        }
      });

      const salaries = payrolls.find(payroll => payroll.salaries.length)?.salaries?.filter(
        (salary) =>
          salary.type === SalaryType.BASIC ||
          salary.type === SalaryType.BASIC_INSURANCE ||
          salary.type === SalaryType.STAY
      );

      return await this.prisma.payroll.create({
        data: {
          employee: {connect: {id: body?.employeeId}},
          createdAt: body.createdAt,
          branch: body.branch.name,
          position: body.position.name,
          recipeType: body.recipeType,
          workday: body.workday,
          tax: TAX,
          salaries: !isInit && salaries?.length
            ? {
              createMany: {
                data: salaries.map((salary) => _.omit(salary, ["payrollId", "id"])),
              },
            }
            : {},
        },
        include: {salaries: true},
      });
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

  async findAll(profile: ProfileEntity, search?: Partial<SearchPayrollDto>) {
    const acc = await this.prisma.account.findUnique({
      where: {id: profile.id},
      include: {branches: true, role: true}
    });

    const template = search?.templateId
      ? await this.prisma.overtimeTemplate.findUnique({
        where: {id: search?.templateId},
        include: {positions: true},
      })
      : null;
    const positions = template?.positions?.map((position) => position.name);
    try {
      const [total, data] = await Promise.all([
        this.prisma.payroll.count({
          where: {
            employee: {
              id: search?.employeeId ? {in: +search.employeeId} : {},
              leftAt: search?.isLeave ? {notIn: null} : {in: null},
              lastName: {contains: search?.name, mode: "insensitive"},
              type: search?.employeeType ? {in: search?.employeeType} : {},
              category: search?.categoryId ? {id: {in: search?.categoryId}} : {}
            },
            branch: acc.branches?.length ? {
              in: acc.branches.map(branch => branch.name),
              mode: "insensitive"
            } : {startsWith: search?.branch, mode: "insensitive"},
            position: positions?.length
              ? {in: positions.map(position => position)}
              : {startsWith: search?.position, mode: "insensitive"},
            createdAt: {
              gte: search?.startedAt,
              lte: search?.endedAt,
            },
            recipeType: {in: search?.recipeType},
            deletedAt: {in: null},
          },
        }),
        this.prisma.payroll.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            employeeId: search?.employeeId ? {in: +search.employeeId} : {},
            employee: {
              leftAt: search?.isLeave ? {notIn: null} : {in: null},
              lastName: {contains: search?.name, mode: "insensitive"},
              type: search?.employeeType ? {in: search?.employeeType} : {},
              category: search?.categoryId ? {id: {in: search?.categoryId}} : {}
            },
            branch: acc.branches?.length ? {
              in: acc.branches.map(branch => branch.name),
              mode: "insensitive"
            } : {startsWith: search?.branch, mode: "insensitive"},
            position: positions?.length
              ? {in: positions.map(position => position)}
              : {startsWith: search?.position, mode: "insensitive"},
            createdAt: {
              gte: search?.startedAt,
              lte: search?.endedAt,
            },
            recipeType: {in: search?.recipeType},
            deletedAt: {in: null},
          },
          include: {
            salaries: true,
            employee: {
              include: {
                contracts: true,
                position: true,
                branch: true,
                category: true
              },
            },
          },
          // Nếu employeeId nhân viên tồn tại thì đang lấy lịch sử phiếu lương của nhân viên đó. nên sẽ sort theo ngày tạo phiếu lượng
          orderBy: !search?.employeeId ? {
            employee: search?.orderBy && search?.orderType
              ? search.orderBy === OrderbyEmployeeEnum.CREATE
                ? {createdAt: search.orderType}
                : search.orderBy === OrderbyEmployeeEnum.POSITION
                  ? {position: {name: search.orderType}}
                  : search.orderBy === OrderbyEmployeeEnum.NAME
                    ? {lastName: search.orderType}
                    : {}
              : {stt: "asc"}
          } : {
            createdAt: "asc"
          }
        }),
      ]);
      return {total, data};
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findSalaries(profile: ProfileEntity, search?: Partial<SearchPayrollDto>) {
    const [total, data] = await Promise.all([
      this.prisma.salary.count({
        where: {
          datetime: !(search.filterType === FilterTypeEnum.BASIC || search.filterType === FilterTypeEnum.STAY)
            ? {
              gte: search.startedAt,
              lte: search.endedAt,
            }
            : {},
          title: {in: search?.titles, mode: "insensitive"},
          price: search?.salaryPrice ? {equals: search?.salaryPrice} : {},
          type: search?.filterType
            ? {
              in: search?.filterType === FilterTypeEnum.BASIC
                ? [SalaryType.BASIC, SalaryType.BASIC_INSURANCE]
                : search.filterType === FilterTypeEnum.ABSENT
                  ? [SalaryType.ABSENT, SalaryType.DAY_OFF]
                  : search.filterType as SalaryType
            }
            : {},
          payroll: {
            branch: profile.branches?.length
              ? {in: profile.branches.map(branch => branch.name)}
              : {startsWith: search?.branch, mode: "insensitive"},
            createdAt: (search.filterType === FilterTypeEnum.BASIC || search.filterType === FilterTypeEnum.STAY)
              ? {
                gte: firstDatetime(search.startedAt),
                lte: lastDatetime(search.endedAt),
              }
              : {
                gte: search.startedAt,
                lte: search.endedAt,
              },
            deletedAt: {in: null}
          }
        },
      }),
      this.prisma.salary.findMany({
        take: search?.take,
        skip: search?.skip,
        where: {
          datetime: !(search.filterType === FilterTypeEnum.BASIC || search.filterType === FilterTypeEnum.STAY)
            ? {
              gte: search.startedAt,
              lte: search.endedAt,
            }
            : {},
          title: {in: search?.titles, mode: "insensitive"},
          price: search?.salaryPrice ? {equals: search?.salaryPrice} : {},
          type: search?.filterType
            ? {
              in: search?.filterType === FilterTypeEnum.BASIC
                ? [SalaryType.BASIC, SalaryType.BASIC_INSURANCE]
                : search.filterType === FilterTypeEnum.ABSENT
                  ? [SalaryType.ABSENT, SalaryType.DAY_OFF]
                  : search.filterType as SalaryType
            }
            : {},
          payroll: {
            branch: profile.branches?.length
              ? {in: profile.branches.map(branch => branch.name)}
              : {startsWith: search?.branch, mode: "insensitive"},
            createdAt: (search.filterType === FilterTypeEnum.BASIC || search.filterType === FilterTypeEnum.STAY)
              ? {
                gte: firstDatetime(search.startedAt),
                lte: lastDatetime(search.endedAt),
              }
              : {
                gte: search.startedAt,
                lte: search.endedAt,
              },
            deletedAt: {in: null}
          }
        },
        include: {
          payroll: {
            include: {employee: true}
          }
        },
        orderBy: {
          payroll: {
            employee: search?.orderBy && search?.orderType
              ? search.orderBy === OrderbyEmployeeEnum.CREATE
                ? {createdAt: search.orderType}
                : search.orderBy === OrderbyEmployeeEnum.POSITION
                  ? {position: {name: search.orderType}}
                  : search.orderBy === OrderbyEmployeeEnum.NAME
                    ? {lastName: search.orderType}
                    : {}
              : {stt: "asc"}
          }
        }
      })
    ]);
    return {
      total, data: data.map(salary => {
        return Object.assign({}, salary.payroll, {salaries: Array.of(_.omit(salary, ["payroll"]))});
      })
    };
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

  async findOne(id: number) {
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
              category: true
            },
          },
        },
      });

      if (!payroll || payroll.deletedAt) {
        throw new NotFoundException("Phiếu lương không tồn tại");
      }
      const payrolls = await this.prisma.payroll.findMany({
        where: {
          employee: {
            branch: {name: {in: payroll.branch}},
            type: {equals: payroll.employee.type || EmployeeType.FULL_TIME},
            leftAt: {in: null},
          },
          createdAt: {
            gte: firstDatetime(payroll.createdAt),
            lte: lastDatetime(payroll.createdAt),
          },
          deletedAt: {in: null}
        },
        select: {id: true},
        orderBy: {
          employee: {
            stt: "asc"
          }
        }
      });
      return Object.assign(payroll, {payrollIds: payrolls.map(payroll => payroll.id)});
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async update(profile: ProfileEntity, id: number, updates: Partial<UpdatePayrollDto>) {
    try {
      // Chỉ xác nhận khi phiếu lương có tồn tại giá trị
      const acc = await this.prisma.account.findUnique({where: {id: profile.id}, include: {role: true}});
      const payroll = await this.findOne(id);
      if (acc.role.role !== RoleEnum.HUMAN_RESOURCE && (updates?.manConfirmedAt || updates?.accConfirmedAt)) {
        if (!payroll.salaries.length) {
          throw new BadRequestException(`Không thể xác nhận phiếu lương rỗng`);
        }
        if (!payroll.salaries.filter(salary => (salary.type === SalaryType.BASIC_INSURANCE || salary.type === SalaryType.BASIC)).length) {
          throw new BadRequestException(`Không thể xác nhận phiếu lương có lương cơ bản rỗng`);
        }

        if (updates?.manConfirmedAt && !payroll.isEdit) {
          throw new BadRequestException(`Phiếu lương đã chốt. Không được phép sửa.`);
        }
      }

      if (moment(updates?.accConfirmedAt || updates?.manConfirmedAt).isBefore(payroll.createdAt)) {
        throw new BadRequestException(`Không thể xác nhận phiếu lương trước ngày vào làm. Vui lòng kiểm tra lại.`);
      }
      return await this.prisma.payroll.update({
        where: {id: id},
        data: {
          isEdit: updates?.isEdit,
          accConfirmedAt: updates?.accConfirmedAt,
          paidAt: updates?.paidAt,
          total: updates?.total,
          manConfirmedAt: updates?.manConfirmedAt,
          actualday: updates?.actualday,
          workday: updates?.workday,
          branch: updates?.branchId ? (await this.prisma.branch.findUnique({where: {id: updates?.branchId}})).name : undefined,
          position: updates?.positionId ? (await this.prisma.position.findUnique({where: {id: updates?.positionId}})).name : undefined,
          taxed: updates?.taxed,
          createdAt: updates?.createdAt,
          tax: updates?.tax,
          recipeType: updates?.recipeType,
          note: updates?.note,
        },
        include: {
          employee: {
            include: {
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
      const found = await this.prisma.payroll.findUnique({where: {id}, include: {salaries: true}});
      if (found.accConfirmedAt && !found.isEdit) {
        throw new BadRequestException("Phiếu lương đã xác nhận, bạn không được phép xóa");
      }
      if (found.salaries?.length) {
        return await this.prisma.payroll.update({where: {id: id}, data: {deletedAt: new Date()}});
      } else {
        return await this.prisma.payroll.delete({where: {id}});
      }
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOvertimes(profile: ProfileEntity, search: Partial<SearchPayrollDto>) {
    const acc = await this.prisma.account.findUnique({where: {id: profile.id}, include: {branches: true}});
    const [total, data] = await Promise.all([
      this.prisma.salary.count({
        where: {
          title: {in: search?.titles, mode: "insensitive"},
          type: {in: SalaryType.OVERTIME},
          datetime: search?.startedAt && search?.endedAt
            ? {
              gte: search?.startedAt,
              lte: search?.endedAt
            } : {},
          payroll: {
            branch: acc.branches?.length
              ? {in: acc.branches.map(branch => branch.name)}
              : {startsWith: search?.branch, mode: "insensitive"},
            deletedAt: {in: null},
            employee: {
              lastName: {contains: search?.name, mode: "insensitive"}
            }
          }
        },
      }),
      this.prisma.salary.findMany({
        where: {
          title: {in: search?.titles, mode: "insensitive"},
          type: {in: SalaryType.OVERTIME},
          datetime: search?.startedAt && search?.endedAt
            ? {
              gte: search?.startedAt,
              lte: search?.endedAt
            } : {},
          payroll: {
            branch: acc.branches?.length
              ? {in: acc.branches.map(branch => branch.name)}
              : {startsWith: search?.branch, mode: "insensitive"},
            deletedAt: {in: null},
            employee: {
              lastName: {contains: search?.name, mode: "insensitive"}
            }
          }
        },
        include: {
          allowance: true,
          payroll: {
            include: {employee: true}
          }
        },
        orderBy: {
          payroll: {
            employee: search?.orderBy && search?.orderType
              ? search.orderBy === OrderbyEmployeeEnum.CREATE
                ? {createdAt: search.orderType}
                : search.orderBy === OrderbyEmployeeEnum.POSITION
                  ? {position: {name: search.orderType}}
                  : search.orderBy === OrderbyEmployeeEnum.NAME
                    ? {lastName: search.orderType}
                    : {}
              : {stt: "asc"}
          }
        }
      })
    ]);
    return {total, data};
  }

  async overtimeTemplate(search: SearchSalaryDto) {
    return await this.prisma.salary.groupBy({
      by: ['title'],
      where: {
        type: {in: search.salaryType === SalaryType.BASIC ? [SalaryType.BASIC, SalaryType.BASIC_INSURANCE] : search.salaryType},
        datetime: {
          gte: search.startedAt,
          lte: search.endedAt,
        },
        payroll: {
          branch: search?.branch ? {startsWith: search.branch, mode: "insensitive"} : {},
          position: search?.position ? {startsWith: search.position, mode: "insensitive"} : {},
          deletedAt: {in: null}
        }
      },
    });
  }

  async findCurrentHolidays(datetime: Date, positionId: Position["id"]) {
    try {
      return await this.prisma.holiday.findMany({
        where: {
          datetime: {
            gte: firstDatetime(datetime),
            lte: lastDatetime(datetime),
          },
          positions: {
            some: {id: {in: positionId}}
          },
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException("Lỗi get current holiday", err);
    }
  }
}



