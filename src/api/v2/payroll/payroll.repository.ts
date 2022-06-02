import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {BaseRepository} from "../../../common/repository/base.repository";
import {PayrollEntity} from "./entities";
import {PrismaService} from "../../../prisma.service";
import {TAX} from "../../../common/constant";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {EmployeeType, RecipeType, RoleEnum, SalaryType} from "@prisma/client";
import {SearchPayrollDto} from "../../v1/payroll/dto/search-payroll.dto";
import {StatusEnum} from "../../../common/enum/status.enum";
import {OrderbyEmployeeEnum} from "../../v1/employee/enums/orderby-employee.enum";
import {firstDatetime, lastDatetime} from "../../../utils/datetime.util";
import {UpdatePayrollDto} from "../../v1/payroll/dto/update-payroll.dto";
import * as moment from "moment";
import {CreatePayrollDto} from "./dto/create-payroll.dto";

@Injectable()
export class PayrollRepository extends BaseRepository<PayrollEntity> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreatePayrollDto) {
    try {
      return await this.prisma.payroll.create({
        data: {
          employee: {connect: {id: body?.employeeId}},
          createdAt: body.createdAt,
          branch: body.branch,
          position: body.position,
          recipeType: body.recipeType,
          workday: body.workday,
          isFlatSalary: body.isFlatSalary,
          tax: TAX
        },
        include: {
          salaries: true,
          employee: true
        },
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

  async createMany(profile: ProfileEntity, bodys: CreatePayrollDto[]) {
    const payrolls = await Promise.all(bodys.map(async body => {
      const payroll = await this.prisma.payroll.findFirst({
        where: {
          employee: {id: {in: body.employeeId}},
          deletedAt: {in: null},
          salaries: {
            some: {
              type: {in: [SalaryType.BASIC, SalaryType.BASIC_INSURANCE, SalaryType.STAY]}
            },
          }
        },
        include: {salariesv2: true},
        orderBy: {
          createdAt: "desc"
        }
      });
      const salaries = payroll?.salariesv2?.filter(
        (salary) =>
          salary.type === SalaryType.BASIC ||
          salary.type === SalaryType.BASIC_INSURANCE ||
          salary.type === SalaryType.STAY
      );
      return await this.prisma.payroll.create({
        data: {
          createdAt: body.createdAt,
          branch: body.branch,
          position: body.position,
          recipeType: body.recipeType,
          workday: body.workday,
          isFlatSalary: body.isFlatSalary,
          tax: body.tax,
          taxed: body.taxed,
          employeeId: body.employeeId,
          salariesv2: salaries?.length
            ? {
              createMany: {
                data: salaries.map(salary => ({
                  title: salary.title,
                  type: salary.type,
                  price: salary.price,
                  rate: salary.rate,
                  note: salary.note,
                  blockId: salary.blockId,
                }))
              }
            }
            : {}
        }
      });
    }));
    return {count: payrolls.length};
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
              lastName: {contains: search?.name, mode: "insensitive"},
              type: search?.employeeType ? {in: search?.employeeType} : {},
              category: search?.categoryId ? {id: {in: search?.categoryId}} : {},
              leftAt: search?.empStatus > -1 && search?.empStatus !== StatusEnum.ALL ? (search?.empStatus === StatusEnum.NOT_ACTIVE ? {notIn: null} : {in: null}) : {},
            },
            branch: acc.branches?.length ? {
              in: search?.branch ? acc.branches.map(branch => branch.name).concat(search?.branch) : acc.branches.map(branch => branch.name),
              mode: "insensitive",
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
              lastName: {contains: search?.name, mode: "insensitive"},
              type: search?.employeeType ? {in: search?.employeeType} : {},
              category: search?.categoryId ? {id: {in: search?.categoryId}} : {},
              leftAt: search?.empStatus > -1 && search?.empStatus !== StatusEnum.ALL ? (search?.empStatus === StatusEnum.NOT_ACTIVE ? {notIn: null} : {in: null}) : {},
            },
            branch: acc.branches?.length ? {
              in: search?.branch ? acc.branches.map(branch => branch.name).concat(search?.branch) : acc.branches.map(branch => branch.name),
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
            employee: {
              include: {
                contracts: true,
                branch: true,
                category: true,
                position: true,
              },
            },
            salaries: true,
            salariesv2: true,
            allowances: true,
            absents: {include: {setting: true}},
            dayoffs: true,
            deductions: true,
            overtimes: {include: {setting: true}},
            remotes: true,
            holidays: {include: {setting: true}},
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
          },
        }),
      ]);
      return {total, data};
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }


  async findOne(id: number) {
    try {
      const payroll = await this.prisma.payroll.findUnique({
        where: {id: id},
        include: {
          employee: {
            include: {
              contracts: true,
              position: true,
              branch: true,
              category: true
            },
          },
          salaries: {
            include: {
              allowance: true
            }
          },
          salariesv2: true,
          absents: {include: {setting: true}},
          deductions: true,
          remotes: {include: {block: true}},
          overtimes: {include: {block: true, setting: true, allowances: true}},
          dayoffs: true,
          allowances: true,
          holidays: {include: {setting: true}}
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
        if (!payroll.salaries.length && !payroll.salariesv2.length) {
          throw new BadRequestException(`Không thể xác nhận phiếu lương rỗng`);
        }
        if (
          !payroll.salaries.filter(salary => (salary.type === SalaryType.BASIC_INSURANCE || salary.type === SalaryType.BASIC)).length
          && !payroll.salariesv2.filter(salary => (salary.type === SalaryType.BASIC_INSURANCE || salary.type === SalaryType.BASIC)).length
          && payroll.recipeType !== RecipeType.CT3
        ) {
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
          isFlatSalary: updates?.isFlatSalary,
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
              contracts: true,
              position: true,
              branch: true,
              category: true
            },
          },
          salaries: {
            include: {
              allowance: true
            }
          },
          salariesv2: true,
          absents: {include: {setting: true}},
          deductions: true,
          remotes: {include: {block: true}},
          overtimes: {include: {block: true, setting: true, allowances: true}},
          dayoffs: true,
          allowances: true,
          holidays: {include: {setting: true}}
        },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }


  async remove(profile: ProfileEntity, id: number) {
    try {
      const acc = await this.prisma.account.findUnique({where: {id: profile.id}});
      const found = await this.prisma.payroll.findUnique({where: {id}, include: {salaries: true}});
      if (found.accConfirmedAt && !found.isEdit) {
        throw new BadRequestException("Phiếu lương đã xác nhận, bạn không được phép xóa");
      }

      if (found.salaries?.length) {
        return await this.prisma.payroll.update({
          where: {id: id},
          data: {deletedAt: new Date(), deleteBy: acc.username}
        });
      } else {
        return await this.prisma.payroll.delete({where: {id}});
      }
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
