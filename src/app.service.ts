import {DatetimeUnit, PartialDay, SalaryType} from "@prisma/client";
import {PrismaService} from "./prisma.service";
import {Injectable} from "@nestjs/common";
import {firstDatetime, lastDatetime} from "./utils/datetime.util";
import * as dateFns from "date-fns";

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {
  }

  async salariesv2(): Promise<any> {
    const salaries = await this.prisma.salary.findMany({
      where: {
        type: {in: [SalaryType.STAY, SalaryType.BASIC, SalaryType.BASIC_INSURANCE]},
        payrollId: {not: null}
      }
    });
    const {count} = await this.prisma.salaryv2.createMany({
      data: salaries.map((salary) => ({
        type: salary.type,
        rate: salary?.rate || 1,
        payrollId: salary.payrollId,
        price: salary.price,
        blockId: salary.type === SalaryType.STAY ? 2 : 1,
        title: salary.title,
        note: salary.note,
        timestamp: salary.timestamp,
      })),
      skipDuplicates: true
    });

    return {message: `Đã tạo ${count} record`};
  }

  async allowance() {
    const allowances = await this.prisma.salary.findMany({
      where: {
        type: {in: SalaryType.ALLOWANCE},
        branchId: {in: null},
        payrollId: {not: null},
      },
      include: {
        payroll: true
      }
    });

    const {count} = await this.prisma.allowanceSalary.createMany({
      data: allowances.map(allowance => {
        return {
          title: allowance.title,
          price: !allowance?.datetime ? allowance.price / allowance.payroll.createdAt.getDate() : allowance.price,
          blockId: 3,
          inWorkday: true,
          inOffice: true,
          rate: 1,
          payrollId: allowance.payrollId,
          startedAt: allowance?.datetime || firstDatetime(allowance.payroll.createdAt),
          endedAt: allowance?.datetime || lastDatetime(allowance.payroll.createdAt),
          timestamp: allowance.timestamp,
          note: allowance.note,
        };
      }),
      skipDuplicates: true
    });
    return {message: `Đã tạo ${count} record allowance`};
  }

  async overtimeSetting() {
    const overtimes = await this.prisma.overtimeTemplate.findMany();
    const {count} = await this.prisma.salarySetting.createMany({
      data: overtimes.map(overtime => ({
        title: overtime.title,
        rate: overtime.rate,
        timestamp: overtime.timestamp,
        type: SalaryType.OVERTIME,
        hasConstraints: true,
        totalOf: !overtime.price ? [SalaryType.BASIC_INSURANCE, SalaryType.BASIC, SalaryType.STAY] : undefined,
        prices: overtime.price ? [overtime.price] : undefined,
        unit: overtime.unit
      })),
      skipDuplicates: true
    });

    return {message: `Đã tạo ${count} record cho salary setting`};
  }

  async overtimeTemplate() {
    const count = [];
    const templates = await this.prisma.overtimeTemplate.findMany({
      include: {branches: true, positions: true}
    });
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      const created = await this.prisma.salarySetting.create({
        data: {
          title: template.title,
          type: SalaryType.OVERTIME,
          hasConstraints: false,
          unit: template.unit,
          prices: template?.price || undefined,
          totalOf: !template?.price ? [SalaryType.BASIC, SalaryType.BASIC_INSURANCE, SalaryType.STAY] : undefined,
          timestamp: template.timestamp,
          rate: template.rate,
          branches: {connect: template.branches.map(branch => ({id: branch.id}))},
          positions: {connect: template.positions.map(position => ({id: position.id}))},
        }
      });
      count.push(created);
    }

    return {message: `Đã tạo ${count} record`};
  }

  async overtime() {
    const overtimes = await this.prisma.salary.findMany({
      where: {
        type: {in: [SalaryType.OVERTIME]},
        payrollId: {not: null},
      }
    });
    const {count} = await this.prisma.overtimeSalary.createMany({
      data: await Promise.all(overtimes.map(async overtime => {
        const setting = await this.prisma.salarySetting.findFirst({
          where: {
            type: {in: [SalaryType.OVERTIME]},
            title: overtime.title,
          }
        });
        return {
          payrollId: overtime.payrollId,
          startedAt: overtime.datetime,
          endedAt: overtime.datetime,
          startTime: overtime?.unit === DatetimeUnit.HOUR ? overtime.datetime : undefined,
          endTime: overtime?.unit === DatetimeUnit.HOUR ? overtime.datetime : undefined,
          timestamp: overtime.timestamp,
          note: overtime.note,
          blockId: 4,
          partial: overtime.partial,
          settingId: setting.id
        };
      })),
      skipDuplicates: true
    });
    return {message: `Đã tạo ${count} record overtimes`};
  }

  async absent() {
    const absents = await this.prisma.salary.findMany({
      where: {
        type: {in: [SalaryType.ABSENT]},
        payrollId: {not: null},
        title: {in: ["Đi trễ", "Về sớm"], mode: "insensitive"}
      }
    });

    const {count} = await this.prisma.absentSalary.createMany({
      data: absents.map(absent => {
        let hours = 0;
        let minutes = 0;

        if (absent.times >= 240) {
          hours = 4;
        } else if (absent.times >= 180) {
          hours = 3;
        } else if (absent.times >= 120) {
          hours = 2;
        } else if (absent.times >= 60) {
          hours = 1;
        }

        if (absent.times > 0 && absent.times < 60) {
          minutes = absent.times;
        } else if (absent.times > 60 && absent.times < 120) {
          minutes = absent.times - 60;
        } else if (absent.times > 120 && absent.times < 180) {
          minutes = absent.times - 120;
        } else if (absent.times > 180 && absent.times < 240) {
          minutes = absent.times - 180;
        }

        const startTime = dateFns.set(absent.datetime, {hours: 7, minutes: 0});
        const endTime = dateFns.set(absent.datetime, {hours: 7 + hours, minutes: minutes});
        return {
          settingId: 47,
          title: absent.title,
          startedAt: absent.datetime,
          endedAt: absent.datetime,
          startTime: startTime,
          endTime: endTime,
          payrollId: absent.payrollId,
          note: absent.note,
          blockId: 5,
          partial: absent.partial,
          timestamp: absent.timestamp,
        };
      }),
    });
    return {message: `Đã tạo ${count} record absent`};
  }

  async dayoff() {
    const dayoffs = await this.prisma.salary.findMany({
      where: {
        type: {in: [SalaryType.DAY_OFF]},
        payrollId: {not: null},
      }
    });

    const {count} = await this.prisma.dayOffSalary.createMany({
      data: dayoffs.map(dayoff => {
        return {
          title: dayoff.title,
          partial: dayoff.partial,
          payrollId: dayoff.payrollId,
          note: dayoff.note,
          startedAt: dayoff.datetime,
          endedAt: dayoff.datetime,
          timestamp: dayoff.timestamp,
        };
      }),
      skipDuplicates: true
    });
    return {message: `Đã tạo ${count} record dayoff`};
  }

  async duduction() {
    const deductions = await this.prisma.salary.findMany({
      where: {
        type: {in: [SalaryType.DEDUCTION]},
        payrollId: {not: null},
      }
    });

    const {count} = await this.prisma.deductionSalary.createMany({
      data: deductions.map(deduction => {
        return {
          title: deduction.title,
          price: deduction.price,
          payrollId: deduction.payrollId,
          note: deduction.note,
          timestamp: deduction.timestamp,
          blockId: 7
        };
      }),
      skipDuplicates: true
    });

    return {message: `Đã tạo ${count} record deduction`};
  }

  // async holiday() {
  //   const salaries = await this.prisma.salary.findMany({
  //     where: {
  //       type: {in: [SalaryType.HOLIDAY]},
  //       payrollId: {not: null},
  //     }
  //   });
  //
  //   for (let i = 0; i < salaries.length; i++) {
  //     const salary = salaries[i];
  //     const settings = await this.prisma.salarySetting.findMany({
  //       where: {
  //         type: {in: [SalaryType.HOLIDAY]},
  //         title: salary.title,
  //         unit: salary.unit,
  //       }
  //     });
  //
  //
  //   }
  // }

  async remote() {
    const remotes = await this.prisma.salary.findMany({
      where: {
        type: {in: [SalaryType.WFH]},
        payrollId: {not: null},
      }
    });

    const {count} = await this.prisma.remoteSalary.createMany({
      data: remotes.map(remote => {
        return {
          payrollId: remote.payrollId,
          note: remote.note,
          timestamp: remote.timestamp,
          type: SalaryType.WFH,
          partial: remote.partial || PartialDay.ALL_DAY,
          startedAt: remote.datetime,
          endedAt: remote.datetime,
          blockId: 9
        };
      }),
      skipDuplicates: true
    });

    return {message: `Đã tạo ${count} record remote`};
  }
}
