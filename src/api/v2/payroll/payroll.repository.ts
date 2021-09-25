import { BadRequestException, Injectable } from "@nestjs/common";
import { Employee, Payroll, SalaryType } from "@prisma/client";
import * as moment from "moment";
import { ProfileEntity } from "../../../common/entities/profile.entity";
import { PrismaService } from "../../../prisma.service";
import { firstMonth, lastMonth } from "../../../utils/datetime.util";
import { searchName } from "../../../utils/search-name.util";
import { CreatePayrollDto } from "./dto/create-payroll.dto";
import { SearchPayrollDto } from "./dto/search-payroll.dto";
import { UpdatePayrollDto } from "./dto/update-payroll.dto";
import { FullPayroll, OnePayroll } from "./entities/payroll.entity";

@Injectable()
export class PayrollRepository {
  constructor(private readonly prisma: PrismaService) {}

  count(query?: any): Promise<number> {
    return Promise.resolve(0);
  }

  async create(body: CreatePayrollDto) {
    try {
      return await this.prisma.payroll
        .create({
          data: body,
          include: { salaries: true },
        })
        .then((currentPayroll) => {
          // get tháng trước
          const lastMonth = moment(new Date())
            .subtract(1, "months")
            .endOf("month")
            .toDate();

          // get payroll của tháng trước để lấy lương cơ bản, bảo hiểm, ở lại
          this.findByEmployeeId(currentPayroll.employeeId, lastMonth).then(
            (lastPayroll: FullPayroll) => {
              // filter payroll của tháng trước để lấy lương cơ bản, bảo hiểm, ở lại
              const salaries = lastPayroll.salaries.filter((salary) => {
                return (
                  salary.type === SalaryType.BASIC ||
                  salary.type === SalaryType.BASIC_INSURANCE ||
                  salary.type === SalaryType.STAY
                );
              });
              // tự thêm vào tháng này
              if (!currentPayroll.salaries.length) {
                this.prisma.salary.createMany({ data: salaries });
              }
            }
          );
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

  // @ts-ignore
  async findAll(
    user: ProfileEntity,
    skip: number,
    take: number,
    search?: Partial<SearchPayrollDto>
  ) {
    try {
      const name = searchName(search?.name);

      const [total, payrolls] = await Promise.all([
        this.prisma.payroll.count({ where: { employee: { leftAt: null } } }),
        this.prisma.payroll.findMany({
          take: take ?? undefined,
          skip: skip ?? undefined,
          where: {
            employee: {
              leftAt: null,
              position: {
                name: { startsWith: search?.position, mode: "insensitive" },
              },
              code: { startsWith: search?.code, mode: "insensitive" },
              AND: {
                firstName: { startsWith: name?.firstName, mode: "insensitive" },
                lastName: { startsWith: name?.lastName, mode: "insensitive" },
              },
            },
            createdAt: {
              gte: firstMonth(search?.createdAt ?? new Date()),
              lte: lastMonth(search?.createdAt ?? new Date()),
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
        }),
      ]);

      return {
        total,
        data: payrolls,
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findByEmployeeId(
    employeeId: Employee["id"],
    datetime?: Date
  ): Promise<FullPayroll> {
    const first = firstMonth(datetime || new Date());
    const last = lastMonth(datetime || new Date());
    try {
      return await this.prisma.payroll.findFirst({
        where: {
          createdAt: {
            gte: first,
            lte: last,
          },
          employeeId: employeeId,
        },
        include: { salaries: true },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findFirst(query: any): Promise<Payroll> {
    try {
      return await this.prisma.payroll.findFirst({
        where: query,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number): Promise<OnePayroll> {
    try {
      return await this.prisma.payroll.findUnique({
        where: { id: id },
        include: {
          salaries: true,
          employee: {
            include: {
              contracts: true,
              position: { include: { branches: true } },
            },
          },
        },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async find(query: any) {
    try {
      return await this.prisma.payroll.findFirst({
        where: {
          employeeId: query.employeeId,
          createdAt: {
            gte: query.first,
            lte: query.last,
          },
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdatePayrollDto) {
    try {
      return await this.prisma.payroll.update({
        where: { id: id },
        data: {
          isEdit: !!updates.accConfirmedAt,
          accConfirmedAt: updates.accConfirmedAt ?? undefined,
          paidAt: updates.paidAt ?? undefined,
          manConfirmedAt: updates.manConfirmedAt ?? undefined,
        },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.payroll.delete({ where: { id: id } });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
