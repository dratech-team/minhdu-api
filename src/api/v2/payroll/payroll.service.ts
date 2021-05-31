import {BadRequestException, Injectable} from '@nestjs/common';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {PrismaService} from "../../../prisma.service";
import {Salary, SalaryType} from '@prisma/client';
import * as moment from "moment";
import * as XLSX from "xlsx";

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {
  }

  /**
   * Tạo payroll dùng cho các khoảng khấu trừ / thương tết / phụ cấp khác
   * */
  async create(employeeId: string) {
    try {
      const basic = await this.prisma.employee.findUnique({
        where: {id: employeeId},
        select: {
          salaries: true
        }
      });

      const connect = basic.salaries.map(e => ({
        id: e.id
      }));

      return this.prisma.payroll.create({
        data: {
          employee: {connect: {id: employeeId}},
          salaries: {connect: connect}
        }
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findAll(branchId: string, skip: number, take: number, search?: string, datetime?: Date) {
    // let date: Date;
    // if(datetime) {
    //   date = new Date(datetime);
    // }
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date();
    try {
      const checkExist = await this.checkPayrollExist(branchId);

      const where = {
        AND: [
          {
            employee: {branchId},
          },
          {
            createdAt: {
              gte: firstDay,
              lte: lastDay,
            }
          },
          {
            OR: [
              {
                employeeId: {startsWith: search}
              },
              {
                employee: {
                  branch: {
                    name: {startsWith: search}
                  }
                }
              },
            ]
          }
        ],
      };
      if (checkExist) {
        const [total, payrolls] = await Promise.all([
          this.prisma.payroll.count({
            where: where
          }),
          this.prisma.payroll.findMany({
            where: where,
            take, skip,
            include: {
              salaries: true,
              employee: {
                include: {
                  branch: true,
                  department: true,
                  position: true,
                }
              }
            }
          })
        ]);
        return {
          total: total,
          data: payrolls.map(payroll => this.totalSalary(payroll)),
        };
      } else {
        return {
          total: 0,
          data: [],
        };
      }
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }

  }

  async findOne(id: number): Promise<any> {
    try {
      const payroll = await this.prisma.payroll.findUnique({
        where: {id: id},
        include: {
          salaries: true,
          employee: {
            include: {
              branch: true,
              department: true,
              position: true,
            }
          }
        }
      });

      return this.totalSalary(payroll);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async update(id: number, updates: UpdatePayrollDto) {
    try {
      const payroll = await this.prisma.payroll.findUnique({where: {id}});
      if (!payroll.isEdit) {
        throw new BadRequestException('Phiếu lương đã được tạo vì vậy bạn không có quyền sửa. Vui lòng liên hệ admin để được hỗ trợ.');
      }
      return await this.prisma.payroll.update({
        where: {id: id},
        data: {
          // salaries: updates.salaryId ? {connect: {id: updates.salaryId}} : {},
          isEdit: updates.isEdit,
          paidAt: updates.isPaid ? new Date() : null,
          confirmedAt: updates.isConfirm ? new Date() : null,
        },
        include: {salaries: true}
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} payroll`;
  }

  actualDay(salaries: Salary[]) {
    return new Date().getDate() - salaries.filter(salary => salary.type === SalaryType.ABSENT)
      .map(e => e.forgot ? e.times * 1.5 : e.times)
      .reduce((a, b) => a + b, 0);
  }

  totalSalary(payroll: any) {
    let basicSalary = 0;
    let staySalary = 0;
    let allowanceSalary = 0;
    let overtime = 0;
    let absentTime = 0;
    let lateTime = 0;
    let daySalary = 0;

    const actualDay = this.actualDay(payroll.salaries);


    for (let i = 0; i < payroll.salaries.length; i++) {
      switch (payroll.salaries[i].type) {
        case SalaryType.BASIC:
          basicSalary += payroll.salaries[i].price;
          break;
        case SalaryType.ALLOWANCE_STAYED:
          staySalary += payroll.salaries[i].price;
          break;
        case SalaryType.ALLOWANCE:
          if (payroll.salaries[i].times === null && payroll.salaries.datetime === null) {
            payroll.salaries[i].times = 1;
          }
          allowanceSalary += payroll.salaries[i].times * payroll.salaries[i].price;
          break;
        case SalaryType.OVERTIME:
          overtime += payroll.salaries[i].rate;
          break;
        // case SalaryType.ABSENT:
        //   if (payroll.salaries[i].forgot) {
        //     absentTime += payroll.salaries[i].times * 1.5;
        //   }
        //   absentTime += payroll.salaries[i].times;
        //   break;
        case SalaryType.LATE:
          lateTime += payroll.salaries[i].times;
          break;
      }
    }

    if (actualDay < payroll.employee.position.workday) {
      daySalary = (basicSalary + staySalary) / payroll.employee.position.workday;
    } else {
      daySalary = basicSalary / payroll.employee.position.workday;
    }

    const tax = payroll.employee.contractAt !== null ? basicSalary * 0.115 : 0;
    const deduction = daySalary / 8 * lateTime + daySalary * absentTime;
    const allowanceOvertime = daySalary * overtime;

    const total = Math.ceil((daySalary * (actualDay + overtime) + allowanceSalary) - tax);

    return {
      id: payroll.id,
      confirmedAt: payroll.confirmedAt,
      paidAt: payroll.paidAt,
      createdAt: payroll.createdAt,
      basic: basicSalary,
      stay: staySalary,
      allowance: allowanceSalary + allowanceOvertime,
      deduction,
      actualDay,
      salaries: payroll.salaries,
      total: !payroll.isEdit ? total : 0,
      tax,
      employee: payroll.employee,
    };
  }

  async print(branchId: string) {
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    try {
      const payrolls = await this.prisma.payroll.findMany({
        where: {
          createdAt: {
            gte: firstDay,
            lte: lastDay,
          },
          employee: {
            branch: {
              id: branchId
            }
          }
        },
        include: {
          employee: {
            include: {
              branch: true,
              department: true,
              position: true,
            }
          },
          salaries: true,
        }
      });
      const res = payrolls.map(payroll => this.totalSalary(payroll));
      return await this.handleExcel(res);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async handleExcel(res: any[]) {
    const fileName = 'ab.xlsx';
    // var data = "a,b,c\n1,2,4".split("\n").map(function (x) {
    //   return x.split(",");
    // });

    // const data = res[0].
    var ws = XLSX.utils.json_to_sheet(res);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

    await XLSX.writeFile(wb, fileName, {bookType: 'xlsx'});
    return fileName;
  }

  async checkPayrollExist(branchId: string): Promise<boolean> {
    const datetime = moment().format('yyyy-MM');
    try {
      const employees = await this.prisma.employee.findMany({
        where: {branchId},
        include: {payrolls: true}
      });

      for (let i = 0; i < employees.length; i++) {
        const count = employees[i].payrolls.filter(payroll => {
          const createdAt = moment(payroll.createdAt).format('yyyy-MM');
          return new Date(createdAt).getTime() === new Date(datetime).getTime();
        });

        if (count.length > 1) {
          throw new BadRequestException(`Có gì đó không đúng. Các nhân viên ${employees[i].name} có nhiều hơn 2 phiếu lương trong tháng này`);
        } else if (count.length === 0) {
          await this.create(employees[i].id).then();
        }
        return true;
      }
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }
}

