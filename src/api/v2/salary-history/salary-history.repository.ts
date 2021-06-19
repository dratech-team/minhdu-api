import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {InterfaceRepository} from "../../../common/repository/interface.repository";
import {SalaryHistory} from "@prisma/client";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {CreateSalaryHistoryDto} from "./dto/create-salary-history.dto";

@Injectable()
export class SalaryHistoryRepository implements InterfaceRepository<SalaryHistory> {
  constructor(private readonly prisma: PrismaService) {
  }

  count(query?: any): Promise<number> {
    return this.prisma.salaryHistory.count();
  }

  async create(body: CreateSalaryHistoryDto): Promise<SalaryHistory> {
    try {
      return await this.prisma.salaryHistory.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(employeeId: number, skip: number, take: number, search?: string): Promise<ResponsePagination<SalaryHistory>> {
    const [total, data] = await Promise.all([
      this.count(),
      this.prisma.salaryHistory.findMany({where: {employee: {id: employeeId}}, take, skip})
    ]);
    return {total, data};
  }

  async findBy(employeeId: number, query: any): Promise<SalaryHistory[]> {
    return await this.prisma.salaryHistory.findMany({where: {employee: {id: employeeId}}});
  }

  findOne(id: number): Promise<SalaryHistory> {
    return Promise.resolve(undefined);
  }

  remove(id: number): void {
  }

  update(id: number, updates: any): Promise<SalaryHistory> {
    return Promise.resolve(undefined);
  }
}
