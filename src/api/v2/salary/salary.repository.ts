import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {InterfaceRepository} from "../../../common/repository/interface.repository";
import {Salary} from '@prisma/client';
import {ResponsePagination} from "../../../common/entities/response.pagination";

@Injectable()
export class SalaryRepository implements InterfaceRepository<Salary> {
  constructor(private readonly prisma: PrismaService) {
  }

  count(employeeId: number): Promise<number> {
    return this.prisma.salary.count({where: {employeeId}});
  }

  async create(body: CreateSalaryDto) {
    try {
      return await this.prisma.salary.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  /*Tìm lịch sử lương của nhân viên bất kỳ*/
  async findAll(employeeId: number, skip: number, take: number, search?: string): Promise<ResponsePagination<Salary>> {
    const [total, data] = await Promise.all([
      this.count(employeeId),
      this.prisma.salary.findMany({
        where: {employeeId}
      }),
    ]);

    return {total, data};
  }

  findBy(branchId: number, query: any): Promise<Salary[]> {
    return Promise.resolve([]);
  }

  async findMany(body: CreateSalaryDto) {
    return await this.prisma.salary.findFirst({where: body});
  }

  async findOne(id: number) {
    return this.prisma.salary.findUnique({where: {id}});
  }

  async update(id: number, updateSalaryDto: UpdateSalaryDto) {
    return this.prisma.salary.update({
      where: {id: id},
      data: updateSalaryDto
    }).catch((err) => {
      console.error(err);
      throw new BadRequestException(err);
    });
  }

  async remove(id: number) {
    this.prisma.salary.delete({where: {id: id}}).catch(err => {
      console.error(err);
      throw new BadRequestException(err);
    });
  }
}
