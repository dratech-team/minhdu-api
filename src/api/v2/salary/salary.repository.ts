import {BadRequestException, Injectable} from "@nestjs/common";
import {SalaryType} from "@prisma/client";
import {PrismaService} from "../../../prisma.service";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";

@Injectable()
export class SalaryRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateSalaryDto) {
    try {
      return await this.prisma.salary.create({
        data: {
          type: body.type,
          unit: body.unit,
          note: body.note,
          times: body.times,
          datetime: body.datetime,
          forgot: body.forgot,
          rate: body.rate,
          price: body.price,
          title: body.title,
          payrolls: {connect: {id: body.payrollId}},
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  // /*Tìm lịch sử lương của nhân viên bất kỳ*/
  // async findAll(
  //   employeeId: number,
  //   skip: number,
  //   take: number,
  //   search?: string
  // ): Promise<ResponsePagination<Salary>> {
  //   const [total, data] = await Promise.all([
  //     this.count(employeeId),
  //     this.prisma.salary.findMany({
  //       where: {employeeId},
  //     }),
  //   ]);
  //
  //   return {total, data};
  // }

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

  async findOne(id: number) {
    return this.prisma.salary.findUnique({where: {id}});
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
    this.prisma.salary.delete({where: {id: id}}).catch((err) => {
      console.error(err);
      throw new BadRequestException(err);
    });
  }
}
