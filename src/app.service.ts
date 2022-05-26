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
          price: allowance.price,
          blockId: 3,
          inWorkday: true,
          inOffice: true,
          rate: 1,
          unit: allowance.unit,
          payrollId: allowance.payrollId,
          startedAt: allowance.unit === DatetimeUnit.MONTH ? firstDatetime(allowance.payroll.createdAt) : allowance?.datetime || firstDatetime(allowance.payroll.createdAt),
          endedAt: allowance.unit === DatetimeUnit.MONTH ? lastDatetime(allowance.payroll.createdAt) : allowance?.datetime || lastDatetime(allowance.payroll.createdAt),
          timestamp: allowance.timestamp,
          note: allowance.note,
        };
      }),
      skipDuplicates: true
    });
    return {message: `Đã tạo ${count} record allowance`};
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
    const count = [];
    const overtimes = await this.prisma.salary.findMany({
      where: {
        type: {in: [SalaryType.OVERTIME]},
        payrollId: {not: null},
        datetime: {not: null}
      },
      include: {
        allowance: true
      }
    });

    for (let i = 0; i < overtimes.length; i++) {
      const overtime = overtimes[i];
      const setting = await this.prisma.salarySetting.findMany({
        where: {
          type: {in: [SalaryType.OVERTIME]},
          title: {contains: overtime.title, mode: "insensitive"},
        }
      });
      if (setting?.length) {
        let hours = 0;
        let minutes = 0;

        if (overtime.times >= 240) {
          hours = 4;
        } else if (overtime.times >= 180) {
          hours = 3;
        } else if (overtime.times >= 120) {
          hours = 2;
        } else if (overtime.times >= 60) {
          hours = 1;
        }

        if (overtime.times > 0 && overtime.times < 60) {
          minutes = overtime.times;
        } else if (overtime.times > 60 && overtime.times < 120) {
          minutes = overtime.times - 60;
        } else if (overtime.times > 120 && overtime.times < 180) {
          minutes = overtime.times - 120;
        } else if (overtime.times > 180 && overtime.times < 240) {
          minutes = overtime.times - 180;
        }
        const startTime = dateFns.set(overtime.datetime, {hours: 7, minutes: 0});
        const endTime = dateFns.set(overtime.datetime, {hours: 7 + hours, minutes: minutes});

        const found = await this.prisma.overtimeSalary.findUnique({
          where: {
            startedAt_endedAt_partial_settingId_payrollId: {
              payrollId: overtime.payrollId,
              startedAt: overtime.datetime,
              endedAt: overtime.datetime,
              partial: overtime.partial,
              settingId: setting[0].id,
            }
          }
        });
        if (!found) {
          const create = await this.prisma.overtimeSalary.create({
            data: {
              payrollId: overtime.payrollId,
              startedAt: overtime.datetime,
              endedAt: overtime.datetime,
              startTime: overtime?.unit === DatetimeUnit.HOUR ? startTime : undefined,
              endTime: overtime?.unit === DatetimeUnit.HOUR ? endTime : undefined,
              timestamp: overtime.timestamp,
              allowances: overtime.allowance ? {
                create: {
                  title: overtime.allowance.title,
                  price: overtime.allowance.price,
                }
              } : {},
              note: overtime.note,
              blockId: 4,
              partial: overtime.partial,
              settingId: setting[0].id
            }
          });
          count.push(create);
        }
      }
    }
    return {message: `Đã tạo ${count.length} record overtimes`};
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

  async holidaySetting() {
    const holidays = await this.prisma.holiday.findMany();
    const {count} = await this.prisma.salarySetting.createMany({
      data: holidays.map(holiday => ({
        title: holiday.name,
        unit: DatetimeUnit.DAY,
        type: SalaryType.HOLIDAY,
        hasConstraints: holiday.isConstraint,
        prices: holiday.price || undefined,
        totalOf: !holiday.price ? [SalaryType.BASIC, SalaryType.BASIC_INSURANCE, SalaryType.STAY] : undefined,
        rate: holiday.rate,
        timestamp: holiday.timestamp,
      })),
      skipDuplicates: true
    });
    return {message: `Đã tạo ${count} record holidaySetting`};
  }

  async holiday() {
    const count = [];
    const salaries = await this.prisma.salary.findMany({
      where: {
        type: {in: [SalaryType.HOLIDAY]},
        payrollId: {not: null},
      }
    });

    for (let i = 0; i < salaries.length; i++) {
      const salary = salaries[i];
      const settings = await this.prisma.salarySetting.findMany({
        where: {
          type: {in: [SalaryType.HOLIDAY]},
          title: salary.title
        }
      });
      const create = await this.prisma.holidaySalary.create({
        data: {
          payrollId: salary.payrollId,
          note: salary.note,
          timestamp: salary.timestamp,
          blockId: 8,
          settingId: settings[0].id,
        }
      });
      count.push(create);
    }
    return {message: `Đã tạo ${count} record holiday`};
  }

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
