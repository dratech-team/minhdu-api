import {BadRequestException, Injectable, NotFoundException,} from "@nestjs/common";
import {DatetimeUnit, SalaryType} from "@prisma/client";
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

const RATE_TIMES = 1;

@Injectable()
export class SalaryRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateSalaryDto) {
    try {
      // validate before create
      const validate = await this.validate(body);
      if (!validate) {
        throw new BadRequestException(`[DEVELOPMENT] Validate ${body.title} for type ${body.type} failure. Pls check it`);
      }
      // passed validate
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
          payroll: {connect: {id: body.payrollId}},
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
        },
        select: {
          payroll: {select: {employee: {select: {firstName: true, lastName: true}}}},
          allowance: true,
          title: true,
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
    if (includesDatetime(holidays.map((holiday) => holiday.datetime), body.datetime as Date)) {
      if (body.times !== PARTIAL_DAY && body.times !== ALL_DAY) {
        throw new BadRequestException(
          `${moment(body.datetime as Date).format(
            "DD/MM/YYYY"
          )} là lễ nên không được phép nghỉ số số tiếng. Chỉ được phép nghỉ 1 ngày hoặc nửa ngày thôi.`
        );
      }

      // Vắng hoặc không đi làm chỉ đc 1 lần trong ngày
      const salary = await this.prisma.salary.findFirst({
        where: {
          datetime: {
            in: body.datetime as Date,
          },
          payrollId: body.payrollId,
          type: {in: [SalaryType.DAY_OFF, SalaryType.ABSENT]}
        },
        select: {
          payroll: {
            select: {
              employee: {select: {firstName: true, lastName: true}}
            }
          }
        }
      });
      if ((body.type === SalaryType.DAY_OFF || SalaryType.ABSENT) && salary) {
        throw new BadRequestException(
          `Ngày ${moment(body.datetime as Date).format(
            "DD/MM/YYYY"
          )} đã tồn tại đi trễ / về sớm / không đi làm / vắng của phiếu lương của nhân viên ${salary?.payroll?.employee?.firstName + " " + salary?.payroll?.employee?.lastName}. Vui lòng không thêm tùy chọn khác.`
        );
      }
    }

    return true;
  }

  validateUniqueBasic(body: CreateSalaryDto, payroll: FullPayroll) {
    // Lương cơ bản, theo hợp đồng, ở lại. không được phép trùng
    const salaries = payroll.salaries.filter(
      (salary) =>
        salary.type === SalaryType.BASIC_INSURANCE ||
        salary.type === SalaryType.BASIC ||
        salary.type === SalaryType.STAY
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
    if (!body.times) {
      throw new BadRequestException(`[DEVELOPMENT] times not null`);
    }
    // Check thêm tăng ca đúng với datetime của payroll
    if (!isEqualDatetime(body.datetime as Date, payroll.createdAt, "MONTH") && body.unit === DatetimeUnit.MONTH) {
      throw new BadRequestException(`Ngày phụ cấp phải là ngày của tháng ${moment(payroll.createdAt).format("MM/YYYY")}. Đã nhắc mấy lần rồi hmmm :)`);
    }
    return true;
  }

  async validateOvertime(body: CreateSalaryDto, payroll: FullPayroll): Promise<boolean> {
    if (!body.times) {
      throw new BadRequestException(`[DEVELOPMENT] times not null`);
    }

    // Check thêm tăng ca đúng với datetime của payroll. Apply cho detail payroll
    if (!body?.employeeIds && body.times === 1 && !isEqualDatetime(body.datetime as Date, payroll.createdAt, "MONTH")) {
      throw new BadRequestException(
        `Ngày tăng ca phải là ngày của tháng ${moment(payroll.createdAt).format(
          "MM/YYYY"
        )}.`
      );
    }


    // Check Tăng ca không trùng cho phiếu lương
    if (body.type === SalaryType.OVERTIME) {
      const templates = await this.prisma.overtimeTemplate.findMany({
        where: {
          AND: {
            title: body.title,
            price: body.price,
            rate: body.rate,
            unit: body.unit,
          },
        },
      });

      if (!templates.length) {
        throw new BadRequestException(
          `Mẫu lương tăng ca không tồn tại trong hệ thống. Vui lòng liên hệ admin để thêm.`
        );
      }
    }

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
        return true;
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
      default: {
        console.error(`type salary must be BASIC, BASIC_INSURANCE, ABSENT, DAY_OFF, ALLOWANCE, OVERTIME. `);
        return false;
      }
    }
  }

  async findAll(take: number, skip: number, search: SearchSalaryDto) {
    try {
      const overtime = await this.prisma.overtimeTemplate.findMany();

      const [total, data] = await Promise.all([
        this.prisma.salary.count({
          where: {
            payroll: {
              createdAt: {
                gte: firstDatetimeOfMonth(search?.datetime || new Date()),
                lte: lastDatetimeOfMonth(search?.datetime || new Date()),
              }
            },
            title: {equals: search?.title || overtime[0]?.title},
            unit: {equals: search?.unit || DatetimeUnit.DAY},
            type: {in: [SalaryType.OVERTIME]}
          }
        }),
        this.prisma.salary.findMany({
          where: {
            payroll: {
              createdAt: {
                gte: firstDatetimeOfMonth(search?.datetime || new Date()),
                lte: lastDatetimeOfMonth(search?.datetime || new Date()),
              }
            },
            title: {equals: search?.title || overtime[0]?.title},
            unit: {equals: search?.unit || DatetimeUnit.DAY},
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
          }
        })
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
      if (salary.payroll.paidAt) {
        throw new BadRequestException(
          "Bảng lương đã thanh toán không được phép sửa"
        );
      }
      return await this.prisma.salary.update({
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
      });
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
}
