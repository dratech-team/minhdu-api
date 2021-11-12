import {BadRequestException, Injectable, NotFoundException,} from "@nestjs/common";
import {DatetimeUnit, PartialDay, SalaryType} from "@prisma/client";
import * as moment from "moment";
import {PrismaService} from "../../../prisma.service";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {OneSalary} from "./entities/salary.entity";
import {includesDatetime, isEqualDatetime} from "../../../common/utils/isEqual-datetime.util";
import {ALL_DAY, PARTIAL_DAY} from "../../../common/constant/datetime.constant";
import {FullPayroll} from "../payroll/entities/payroll.entity";
import {firstDatetimeOfMonth, lastDatetimeOfMonth} from "../../../utils/datetime.util";
import {SearchSalaryDto} from "./dto/search-salary.dto";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {CreateForEmployeesDto} from "./dto/create-for-employees.dto";

const RATE_TIMES = 1;

@Injectable()
export class SalaryRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateSalaryDto) {
    try {
      // validate before create
      if (body?.payrollId) {
        const validate = await this.validate(body);
        if (!validate) {
          throw new BadRequestException(`[DEVELOPMENT] Validate ${body.title} for type ${body.type} failure. Pls check it`);
        }
      }

      const salary = await this.prisma.salary.findFirst({
        where: {
          datetime: {in: body.datetime as Date},
          unit: body.unit,
          times: body.times,
        }
      });

      if (
        salary &&
        body.type === SalaryType.ABSENT &&
        (body.partial === PartialDay.MORNING || body.partial === PartialDay.AFTERNOON) &&
        body.times === PARTIAL_DAY
      ) {
        return await this.prisma.salary.update({
          where: {id: salary.id},
          data: {
            times: ALL_DAY,
            title: "Vắng nguyên ngày",
            partial: PartialDay.ALL_DAY,
          },
          include: {
            payroll: {
              include: {
                employee: true
              }
            },
            allowance: true,
          }
        });
      }
      return await this.prisma.salary.create({
        data: {
          title: body.title,
          type: body.type,
          unit: body.unit,
          datetime: body.datetime as Date,
          times: body.times,
          forgot: body.forgot,
          rate: body.rate,
          price: body.price,
          note: body.note,
          payroll: body?.payrollId ? {connect: {id: body.payrollId}} : {},
          allowance: body?.allowance?.title
            ? {
              create: {
                title: body.allowance.title,
                type: SalaryType.OVERTIME,
                price: body.allowance.price,
                times: body.unit === DatetimeUnit.DAY ? body.times : RATE_TIMES, // phụ cấp tăng ca nhân cùng với số ngày của tăng ca. Nếu là giờ thì sẽ là 1
              },
            }
            : {},
          branch: body?.branchId ? {connect: {id: body?.branchId}} : {},
          partial: body.partial,
        },
        include: {
          payroll: {
            include: {
              employee: true
            }
          },
          allowance: true,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async validateAbsent(body: CreateSalaryDto) {
    // Ngày lễ chỉ được nghỉ nữa ngày hoặc 1 ngày. Không được đi trễ / đến sớm, về muộn
    const holidays = await this.prisma.holiday.findMany({
      where: {
        datetime: {
          in: body.datetime as Date,
        },
      },
    });
    // holiday
    if (includesDatetime(holidays.map((holiday) => holiday.datetime), body.datetime as Date)) {
      if (body.times !== PARTIAL_DAY && body.times !== ALL_DAY) {
        throw new BadRequestException(
          `${moment(body.datetime as Date).format(
            "DD/MM/YYYY"
          )} là lễ nên không được phép nghỉ số số tiếng. Chỉ được phép nghỉ 1 ngày hoặc nửa ngày thôi.`
        );
      }
    }

    const salary = await this.prisma.salary.findFirst({
      where: {
        payrollId: body.payrollId,
        type: {in: [SalaryType.DAY_OFF, SalaryType.ABSENT]},
        datetime: {
          in: body.datetime as Date
        }
      },
      include: {
        payroll: true
      }
    });
    if (salary && body.type === SalaryType.ABSENT && body.unit === DatetimeUnit.DAY) {

      // không thể thêm cùng vắng 1 buổi hoặc cùng vắng 1 ngày.
      if (body.partial === salary.partial) {
        throw new BadRequestException(`Ngày ${moment(body.datetime as Date).format(
            "DD/MM/YYYY"
          )} đã tồn tại đi trễ / về sớm / không đi làm / vắng đã tồn tại ${body.partial}. Vui lòng kiểm tra lại`
        );
      }

      // Đã tổn tại vắng 1 buổi. chặn thêm văng 1 ngày
      if ((salary.partial === PartialDay.MORNING || salary.partial === PartialDay.AFTERNOON) && body.partial === PartialDay.ALL_DAY) {
        throw new BadRequestException(`Ngày ${moment(body.datetime as Date).format(
            "DD/MM/YYYY"
          )} đã tồn tại đi trễ / về sớm / không đi làm / vắng đã tồn tại 1 buổi ${salary.partial} nên không thể thêm vắng 1 ngày . Vui lòng kiểm tra lại`
        );
      }

      // Đã tồn tại vắng 1 ngày. không thể thêm vắng 1 buổi.
      if ((salary.partial === PartialDay.ALL_DAY) && (body.partial === PartialDay.MORNING || PartialDay.AFTERNOON)) {
        throw new BadRequestException(`Ngày ${moment(body.datetime as Date).format(
            "DD/MM/YYYY"
          )} đã tồn tại đi trễ / về sớm / không đi làm / vắng đã tồn tại vắng 1 ngày nên không thể thêm vắng 1 buổi ${salary.partial}. Vui lòng kiểm tra lại`
        );
      }
    }

    const employee = await this.prisma.employee.findFirst({
      where: {
        payrolls: {
          some: {
            id: body.payrollId,
          }
        }
      }
    });

    if (moment(body.datetime as Date).isBefore(employee.createdAt)) {
      throw new BadRequestException(`Nhân viên vào làm ngày ${moment(employee.createdAt).format("DD/MM/YYYY")} không được thêm vắng trước ngày này. Xin vui lòng kiểm tra lại.`);
    }
    return true;
  }

  validateUniqueBasic(body: CreateSalaryDto, payroll: FullPayroll) {
    // Lương cơ bản, theo hợp đồng, ở lại. không được phép trùng
    const salaries = payroll.salaries.filter(
      (salary) =>
        salary.type === SalaryType.BASIC_INSURANCE ||
        salary.type === SalaryType.BASIC
    );
    const isEqualTitle = salaries.some(salary => salary.title === body.title);
    // const isEqualPrice = salaries
    //   .map((salary) => salary.price)
    //   .includes(body.price);

    if (isEqualTitle) {
      throw new BadRequestException(
        `${body.title} đã tồn tại. Vui lòng không thêm`
      );
    }

    return true;
  }

  validateUniqueStay(body: CreateSalaryDto, payroll: FullPayroll) {
    const salaries = payroll.salaries.filter(
      (salary) => salary.type === SalaryType.STAY
    );

    const isEqualTitle = salaries.some(salary => salary.title === body.title);
    // const isEqualPrice = salaries
    //   .map((salary) => salary.price)
    //   .includes(body.price);

    if (isEqualTitle) {
      throw new BadRequestException(
        `${body.title} đã tồn tại. Vui lòng không thêm`
      );
    }

    return true;
  }

  validateAllowance(body: CreateSalaryDto, payroll: FullPayroll): boolean {
    // if (!body.times) {
    //   throw new BadRequestException(`[DEVELOPMENT] times not null`);
    // }
    /// FIXME:
    // Check thêm tăng ca đúng với datetime của payroll
    // if (!isEqualDatetime(new Date(body.datetime as Date), payroll.createdAt, "MONTH") && body.unit === DatetimeUnit.MONTH) {
    //   throw new BadRequestException(`Ngày phụ cấp phải là ngày của tháng ${moment(payroll.createdAt).format("MM/YYYY")}. Đã nhắc mấy lần rồi hmmm :)`);
    // }
    return true;
  }

  async validateOvertime(body: CreateSalaryDto, payroll: FullPayroll): Promise<boolean> {
    if (!body.times) {
      throw new BadRequestException(`[DEVELOPMENT] times not null`);
    }

    // Check thêm tăng ca đúng với datetime của payroll. Apply cho detail payroll
    if (!body?.employeeIds && body.times === 1 && !isEqualDatetime(body.datetime as Date, payroll.createdAt, "month")) {
      throw new BadRequestException(
        `Ngày tăng ca phải là ngày của tháng ${moment(payroll.createdAt).format(
          "MM/YYYY"
        )}.`
      );
    }

    // if (includesDatetime(payroll.salaries.map(salary => salary.datetime), body.datetime as Date) && body.unit === DatetimeUnit.DAY) {
    //   throw new BadRequestException(`Ngày ${moment(body.datetime as Date).format("dd/MM/yyyy")} đã tồn tại ngày tăng ca. Vui lòng kiểm tra lại`);
    // }

    return true;
  }

  async validate(body: CreateSalaryDto): Promise<boolean> {
    const payroll = await this.prisma.payroll.findUnique({
      where: {id: body.payrollId},
      include: {salaries: true},
    });

    switch (body.type) {
      case SalaryType.BASIC:
      case SalaryType.BASIC_INSURANCE: {
        return this.validateUniqueBasic(body, payroll);
      }
      case SalaryType.STAY: {
        return this.validateUniqueStay(body, payroll);
      }
      case SalaryType.ALLOWANCE: {
        return this.validateAllowance(body, payroll);
      }
      case SalaryType.ABSENT:
      case SalaryType.DAY_OFF: {
        return await this.validateAbsent(body);
      }
      case SalaryType.OVERTIME: {
        return await this.validateOvertime(body, payroll);
      }
      // default: {
      //   console.error(`type salary must be BASIC, BASIC_INSURANCE, ABSENT, DAY_OFF, ALLOWANCE, OVERTIME. `);
      //   return false;
      // }
    }
    return true;
  }

  async findAll(search: SearchSalaryDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.salary.count({
          where: {
            payroll: {
              createdAt: {
                gte: firstDatetimeOfMonth(search?.createdAt || new Date()),
                lte: lastDatetimeOfMonth(search?.createdAt || new Date()),
              },
              employee: {
                id: search?.employeeId || undefined,
              },
              salaries: search?.employeeId ? {
                some: {
                  type: {in: [SalaryType.BASIC, SalaryType.BASIC_INSURANCE, SalaryType.STAY]}
                }
              } : {}
            },
            title: {equals: search?.title},
            unit: {equals: search?.unit},
            type: {in: [SalaryType.OVERTIME]}
          },
        }),
        this.prisma.salary.findMany({
          where: {
            payroll: {
              createdAt: {
                gte: firstDatetimeOfMonth(search?.createdAt || new Date()),
                lte: lastDatetimeOfMonth(search?.createdAt || new Date()),
              },
              employee: {
                id: search?.employeeId || undefined,
              },
              salaries: search?.employeeId ? {
                some: {
                  type: {in: [SalaryType.BASIC, SalaryType.BASIC_INSURANCE, SalaryType.STAY]}
                }
              } : {}
            },
            title: {equals: search?.title},
            unit: {equals: search?.unit},
            type: {in: [SalaryType.OVERTIME]}
          },
          include: {
            payroll: {
              select: {
                employee: {
                  select: {id: true, firstName: true, lastName: true, gender: true, position: true}
                }
              }
            },
          },
          orderBy: {
            datetime: "asc"
          }
        }),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number): Promise<OneSalary> {
    try {
      return await this.prisma.salary.findUnique({
        where: {id},
        include: {payroll: true},
      });
    } catch (err) {
      console.error(err);
      throw new NotFoundException(err);
    }
  }

  async update(id: number, updates: UpdateSalaryDto) {
    try {
      const salary = await this.findOne(id);
      if (salary?.payroll?.paidAt) {
        throw new BadRequestException(
          "Bảng lương đã thanh toán không được phép sửa"
        );
      }

      const updated = await this.prisma.salary.update({
        where: {id: id},
        data: {
          title: updates.title,
          type: updates.type,
          unit: updates.unit,
          datetime: updates.datetime as Date,
          times: updates.times,
          forgot: updates.forgot,
          rate: updates.rate,
          price: updates.price,
          note: updates.note,
          allowance: updates.allowance
            ? {
              upsert: {
                create: {
                  title: updates.allowance?.title,
                  price: updates.allowance?.price,
                  type: SalaryType.OVERTIME,
                },
                update: {
                  title: updates.allowance?.title,
                  price: updates.allowance?.price,
                },
              },
            }
            : {},
        },
        include: {
          payroll: {select: {employeeId: true}}
        }
      });
      // log salary history
      if (salary.type === SalaryType.BASIC || salary.type === SalaryType.BASIC_INSURANCE || salary.type === SalaryType.STAY) {
        this.prisma.salaryHistory.create({
          data: {
            title: salary.title,
            price: salary.price,
            employeeId: salary.payroll.employeeId,
          }
        }).then();
      }
      return updated;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      const payroll = await this.prisma.payroll.findUnique({where: {id}});
      if (payroll?.paidAt) {
        throw new BadRequestException(
          "Bảng lương đã thanh toán không được phép xoá"
        );
      }

      return await this.prisma.salary.delete({where: {id: id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  ///FIXME: Dùng 1 lần xong xoá
  async findEmployees(profile: ProfileEntity, body: CreateForEmployeesDto) {
    return await this.prisma.employee.findMany({
      where: {
        branchId: profile.branches.length ? {in: profile.branches.map(branch => branch.id)} : {},
        id: {in: body.employeeIds}
      },
      include: {
        payrolls: true,
      }
    });
  }

  ///FIXME: Dùng 1 lần xong xoá
  async createEmp(body: CreateSalaryDto) {
    return await this.prisma.salary.create({
      data: {
        title: body.title,
        price: body.price,
        type: body.type,
        payroll: {connect: {id: body.payrollId}},
      }
    });
  }
}
