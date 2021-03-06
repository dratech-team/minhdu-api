import {BadRequestException, Injectable, NotFoundException,} from "@nestjs/common";
import {DatetimeUnit, PartialDay, SalaryType} from "@prisma/client";
import * as moment from "moment";
import {PrismaService} from "../../../../prisma.service";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {OneSalary} from "./entities/salary.entity";
import {includesDatetime} from "../../../../common/utils/isEqual-datetime.util";
import {ALL_DAY, PARTIAL_DAY} from "../../../../common/constant";
import {FullPayroll} from "../../payroll/entities/payroll.entity";
import {SearchSalaryDto} from "./dto/search-salary.dto";
import {ProfileEntity} from "../../../../common/entities/profile.entity";
import {CreateForEmployeesDto} from "./dto/create-for-employees.dto";
import {UpdateManySalaryDto} from "./dto/update-many-salary.dto";
import {firstDatetime, lastDatetime} from "../../../../utils/datetime.util";

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
        await this.validatePayroll(body.payrollId);
        if (!validate) {
          throw new BadRequestException(`[DEVELOPMENT] Validate ${body.title} for type ${body.type} failure. Pls check it`);
        }
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
                type: SalaryType.ALLOWANCE,
                price: body.allowance.price,
                times: body.unit === DatetimeUnit.DAY ? body.times : RATE_TIMES, // ph??? c???p t??ng ca nh??n c??ng v???i s??? ng??y c???a t??ng ca. N???u l?? gi??? th?? s??? l?? 1
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
    // Ng??y l??? ch??? ???????c ngh??? n???a ng??y ho???c 1 ng??y. Kh??ng ???????c ??i tr??? / ?????n s???m, v??? mu???n
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
          )} l?? l??? n??n kh??ng ???????c ph??p ngh??? s??? s??? ti???ng. Ch??? ???????c ph??p ngh??? 1 ng??y ho???c n???a ng??y th??i.`
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
    if (salary && body.unit === DatetimeUnit.DAY && (body.type === SalaryType.ABSENT || body.type === SalaryType.DAY_OFF)) {

      // kh??ng th??? th??m c??ng v???ng 1 bu???i ho???c c??ng v???ng 1 ng??y.
      if (body.partial === salary.partial) {
        throw new BadRequestException(`Ng??y ${moment(body.datetime as Date).format(
          "DD/MM/YYYY"
          )} ???? t???n t???i ??i tr??? / v??? s???m / kh??ng ??i l??m / v???ng ???? t???n t???i ${body.partial}. Vui l??ng ki???m tra l???i`
        );
      }

      // ???? t???n t???i v???ng 1 bu???i. ch???n th??m v??ng 1 ng??y
      if ((salary.partial === PartialDay.MORNING || salary.partial === PartialDay.AFTERNOON) && body.partial === PartialDay.ALL_DAY) {
        throw new BadRequestException(`Ng??y ${moment(body.datetime as Date).format(
          "DD/MM/YYYY"
          )} ???? t???n t???i ??i tr??? / v??? s???m / kh??ng ??i l??m / v???ng ???? t???n t???i 1 bu???i ${salary.partial} n??n kh??ng th??? th??m v???ng 1 ng??y . Vui l??ng ki???m tra l???i`
        );
      }

      // ???? t???n t???i v???ng 1 ng??y. kh??ng th??? th??m v???ng 1 bu???i.
      if ((salary.partial === PartialDay.ALL_DAY) && (body.partial === PartialDay.MORNING || PartialDay.AFTERNOON)) {
        throw new BadRequestException(`Ng??y ${moment(body.datetime as Date).format(
          "DD/MM/YYYY"
          )} ???? t???n t???i ??i tr??? / v??? s???m / kh??ng ??i l??m / v???ng ???? t???n t???i v???ng 1 ng??y n??n kh??ng th??? th??m v???ng 1 bu???i ${salary.partial}. Vui l??ng ki???m tra l???i`
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
      throw new BadRequestException(`Nh??n vi??n v??o l??m ng??y ${moment(employee.createdAt).format("DD/MM/YYYY")} kh??ng ???????c th??m v???ng tr?????c ng??y n??y. Xin vui l??ng ki???m tra l???i.`);
    }
    return true;
  }

  validateUniqueBasic(body: CreateSalaryDto, payroll: FullPayroll) {
    // L????ng c?? b???n, theo h???p ?????ng, ??? l???i. kh??ng ???????c ph??p tr??ng
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
        `${body.title} ???? t???n t???i. Vui l??ng kh??ng th??m`
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
        `${body.title} ???? t???n t???i. Vui l??ng kh??ng th??m`
      );
    }

    return true;
  }

  validateAllowance(body: CreateSalaryDto, payroll: FullPayroll): boolean {
    // if (!body.times) {
    //   throw new BadRequestException(`[DEVELOPMENT] times not null`);
    // }
    /// FIXME:
    // Check th??m t??ng ca ????ng v???i datetime c???a payroll
    // if (!isEqualDatetime(new Date(body.datetime as Date), payroll.createdAt, "MONTH") && body.unit === DatetimeUnit.MONTH) {
    //   throw new BadRequestException(`Ng??y ph??? c???p ph???i l?? ng??y c???a th??ng ${moment(payroll.createdAt).format("MM/YYYY")}. ???? nh???c m???y l???n r???i hmmm :)`);
    // }
    return true;
  }

  async validateOvertime(body: CreateSalaryDto, payroll: FullPayroll): Promise<boolean> {
    if (!body.times) {
      throw new BadRequestException(`[DEVELOPMENT] times not null`);
    }

    // Check th??m t??ng ca ????ng v???i datetime c???a payroll. Apply cho detail payroll
    // if (!body?.employeeIds && body.times === 1 && !isEqualDatetime(body.datetime as Date, payroll.createdAt, "month")) {
    //   throw new BadRequestException(
    //     `Ng??y t??ng ca ph???i l?? ng??y c???a th??ng ${moment(payroll.createdAt).format(
    //       "MM/YYYY"
    //     )}.`
    //   );
    // }

    // if (includesDatetime(payroll.salaries.map(salary => salary.datetime), body.datetime as Date) && body.unit === DatetimeUnit.DAY) {
    //   throw new BadRequestException(`Ng??y ${moment(body.datetime as Date).format("dd/MM/yyyy")} ???? t???n t???i ng??y t??ng ca. Vui l??ng ki???m tra l???i`);
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

  async findAll(search: Partial<SearchSalaryDto>) {
    try {
      return await this.prisma.salary.findMany({
        where: {
          payroll: {
            employeeId: search.employeeId
          },
          title: search.title,
          unit: {in: search.unit},
          type: {in: SalaryType.OVERTIME}
        }
      });
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

  async update(id: number, updates: Partial<UpdateSalaryDto & Pick<UpdateManySalaryDto, "allowanceDeleted">>) {
    try {
      const salary = await this.findOne(id);
      if (!salary?.payroll.isEdit) {
        throw new BadRequestException(
          "B???ng l????ng ???? x??c nh???n. Kh??ng ???????c ph??p s???a"
        );
      }

      const updated = await this.prisma.salary.update({
        where: {id: id},
        data: {
          title: updates?.title,
          type: updates?.type,
          unit: updates?.unit,
          partial: updates?.partial,
          datetime: updates?.datetime as Date,
          times: updates?.times,
          forgot: updates?.forgot,
          rate: updates?.rate,
          price: updates?.price,
          note: updates?.note,
          allowance: updates?.allowance
            ? {
              upsert: {
                create: {
                  title: updates.allowance.title,
                  price: updates.allowance.price,
                  type: SalaryType.ALLOWANCE,
                },
                update: {
                  title: updates.allowance?.title,
                  price: updates.allowance?.price,
                  type: SalaryType.ALLOWANCE,
                },
              },
            }
            : updates?.allowanceDeleted
              ? {delete: true}
              : {},
        },
        include: {
          payroll: {select: {employeeId: true}}
        }
      });
      // log salary history
      if (salary.type === SalaryType.BASIC || salary.type === SalaryType.BASIC_INSURANCE || salary.type === SalaryType.STAY) {
        await this.prisma.salaryHistory.create({
          data: {
            title: salary.title,
            price: salary.price,
            employeeId: salary.payroll.employeeId,
          }
        });
      }
      return updated;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      const found = await this.prisma.salary.findUnique({where: {id}});
      await this.validatePayroll(found.payrollId);
      return await this.prisma.salary.delete({where: {id}});
    } catch (err) {
      console.error("err", err);
      throw new BadRequestException(err);
    }
  }

  private async validatePayroll(payrollId: number) {
    const payroll = await this.prisma.payroll.findUnique({where: {id: payrollId}});
    if (!payroll?.isEdit) {
      if (payroll.accConfirmedAt) {
        throw new BadRequestException(
          "B???ng l????ng ???? ???????c k??? to??n x??c nh???n. kh??ng ???????c ph??p s???a"
        );
      }
      if (payroll.manConfirmedAt) {
        throw new BadRequestException(
          "B???ng l????ng ???? ???????c qu???n l?? x??c nh???n. kh??ng ???????c ph??p s???a"
        );
      }

      if (payroll.paidAt) {
        throw new BadRequestException(
          "B???ng l????ng ???? ???????c thanh to??n. kh??ng ???????c ph??p s???a"
        );
      }
    }


    return true;
  }

  // chuy???n datetime trong salary n??y t??? payroll n??y sang payroll kh??c.
  async changeDatetime(id: number, updates: UpdateSalaryDto) {
    try {
      const salary = await this.prisma.salary.findUnique({where: {id}});
      const payroll = await this.prisma.payroll.findFirst({
        where: {
          createdAt: {
            gte: firstDatetime(updates.datetime as Date),
            lte: lastDatetime(updates.datetime as Date),
          }
        }
      });

      if (!payroll) {
        throw new BadRequestException(`Kh??ng t???n t???i phi???u l????ng c???a th??ng ${moment(updates.datetime as Date).format("MM/YYYY")}`);
      }

      const deleted = this.prisma.salary.delete({where: {id}});
      const created = this.prisma.salary.create({
        data: Object.assign(salary, {
          payrollId: payroll.id,
          datetime: updates.datetime as Date
        })
      });
      return (await this.prisma.$transaction([deleted, created]))[1];
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  ///FIXME: D??ng 1 l???n xong xo??
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

  async migrate() {
    const salaries = await Promise.all([]);
  }
}
