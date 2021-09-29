import {BadRequestException, Injectable, NotFoundException,} from "@nestjs/common";
import {SalaryType} from "@prisma/client";
import {PrismaService} from "../../../prisma.service";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {OneSalary} from "./entities/salary.entity";

@Injectable()
export class SalaryRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateSalaryDto & { allowance?: CreateSalaryDto }) {
    try {
      return await this.prisma.salary.create({
        data: {
          title: body.title,
          type: body.type,
          unit: body.unit,
          datetime: body.datetime,
          times: body.times,
          forgot: body.forgot,
          rate: body.rate,
          price: body.price,
          note: body.note,
          payroll: {connect: {id: body.payrollId}},
          allowance: body.allowance ? {
            create: {
              title: body.allowance.title,
              type: body.allowance.type || SalaryType.OVERTIME,
              price: body.allowance.price
            }
          } : {},
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException("Thất bại", err);
    }
  }

  async findBy(query: any): Promise<any> {
    try {
      return this.prisma.salary.findFirst({where: {}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findMany(body: CreateSalaryDto) {
    return await this.prisma.salary.findFirst({where: body});
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

  async updateAllowanceByOvertime() {
  }

  async update(id: number, updates: UpdateSalaryDto) {
    try {
      return await this.prisma.salary.update({
        where: {id: id},
        data: updates,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.salary.delete({where: {id: id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
