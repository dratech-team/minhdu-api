import {Injectable} from "@nestjs/common";
import {Degree} from "@prisma/client";
import {InterfaceRepository} from "../../../common/repository/interface.repository";
import {PrismaService} from "../../../prisma.service";
import {ResponsePagination} from "../../../common/entities/response.pagination";

@Injectable()
export class DegreeRepository implements InterfaceRepository<Degree> {
  constructor(private readonly prisma: PrismaService) {
  }

  async count(): Promise<number> {
    return await this.prisma.degree.count();
  }

  create(body: any): Promise<Degree> {
    return Promise.resolve(undefined);
  }

  async findAll(employeeId: number, skip: number, take: number, search?: string): Promise<ResponsePagination<Degree>> {
    const [total, data] = await Promise.all([
      this.count(),
      this.prisma.degree.findMany({
        where: {employeeId},
        take, skip,
      }),
    ]);
    return {total, data};
  }

  findBy(branchId: number, query: any): Promise<[]> {
    return Promise.resolve([]);
  }

  findOne(id: number): Promise<Degree> {
    return Promise.resolve(undefined);
  }

  remove(id: number): void {
  }

  update(id: number, updates: any): Promise<Degree> {
    return Promise.resolve(undefined);
  }

}
