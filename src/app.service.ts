import {SalaryType} from "@prisma/client";
import {PrismaService} from "./prisma.service";

export class AppService {
  constructor(private readonly prisma: PrismaService) {
  }

  async salariesv2(): Promise<any> {
    const salaries = await this.prisma.salary.findMany();
    let created: any;
    for (let i = 0; i < salaries.length; i++) {
      const salary = salaries[i];
      if (salary.type === SalaryType.STAY || salary.type === SalaryType.BASIC || salary.type === SalaryType.BASIC_INSURANCE) {
        created = await this.prisma.salaryv2.create({
          data: {
            type: salary.type,
            rate: salary?.rate || 1,
            payroll: {connect: {id: salary.id}},
            price: salary.price,
            block: {connect: {id: salary.type === SalaryType.STAY ? 2 : 1}},
            note: salary.note,
            title: salary.title,
            timestamp: salary.timestamp,
          }
        });
      } else if (salary.type === SalaryType.ALLOWANCE) {
        created = await this.prisma.allowanceSalary.create({
          data: {
            title: salary.title,
            startedAt: salary.datetime,
            endedAt: salary.datetime,
            payroll: {connect: {id: salary.payrollId}},
            price: salary.price,
            block: {connect: {id: 3}},
            note: salary.note,
            timestamp: salary.timestamp,
          }
        });
      } else if (salary.type === SalaryType.ABSENT) {
        created = await this.prisma.absentSalary.create({
          data: {
            title: salary.title,
            payroll: {connect: {id: salary.payrollId}},
            block: {connect: {id: 5}},
            startedAt: salary.datetime,
            endedAt: salary.datetime,
            setting: {connect: {id: 1}},
            partial: salary.partial,
            note: salary.note,
            startTime: salary.datetime,
            endTime: salary.datetime,
            timestamp: salary.timestamp,
          }
        });
      } else if (salary.type === SalaryType.DAY_OFF) {
        created = await this.prisma.dayOffSalary.create({
          data: {
            title: salary.title,
            startedAt: salary.datetime,
            endedAt: salary.datetime,
            payroll: {connect: {id: salary.payrollId}},
            partial: salary.partial,
            timestamp: salary.timestamp,
            note: salary.note,
          }
        });
      } else if(salary.type === SalaryType.DEDUCTION) {
        created = await this.prisma.deductionSalary.create({
          data: {
            title: salary.title,
            price: salary.price,
            payroll: {connect: {id: salary.payrollId}},
            block: {connect: {id: 7}},
            timestamp: salary.timestamp,
            note: salary.note,
          }
        });
      } else if(salary.type === SalaryType.HOLIDAY) {

      } else if(salary.type === SalaryType.WFH) {
        created = await this.prisma.remoteSalary.create({
          data: {
            payroll: {connect: {id: salary.payrollId}},
            note: salary.note,
            timestamp: salary.timestamp,
            block: {connect: {id: 9}},
            partial: salary.partial,
            startedAt: salary.datetime,
            endedAt: salary.datetime,
            type: "WFH",
          }
        });
      }
      console.log(`Đã migrate thành công ${created.title} cho phiếu lương có id ${created.payrollId} thuộc block ${created.blockId}`);
    }
  }
}
