import {BadRequestException, Injectable} from "@nestjs/common";
import {WorkHistory} from "@prisma/client";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class WorkHistoryRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  count(query?: any): Promise<number> {
    return this.prisma.workHistory.count();
  }

  async create(positionId: number, employeeId: number): Promise<WorkHistory> {
    try {
      return await this.prisma.workHistory.create({
        data: {employeeId, positionId}
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(id: number, skip: number, take: number, search?: string): Promise<ResponsePagination<WorkHistory>> {
    const [total, data] = await Promise.all([
      this.count(),
      this.prisma.workHistory.findMany({
        skip, take
      })
    ]);
    return {total, data};
  }

  findBy(branchId: number, query: any): Promise<WorkHistory[]> {
    return Promise.resolve([]);
  }

  findOne(id: number): Promise<WorkHistory> {
    return this.prisma.workHistory.findUnique({where: {id}});
  }

  remove(id: number): void {
    this.prisma.workHistory.delete({where: {id}});
  }

  async update(id: number, updates: any): Promise<WorkHistory> {
    try {
      return await this.prisma.workHistory.update({where: {id}, data: updates});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

}
