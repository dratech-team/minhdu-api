import {InterfaceRepository} from "./interface.repository";
import {ResponsePagination} from "../entities/response.pagination";
import {PrismaService} from "../../prisma.service";

export class BaseRepository<T> implements InterfaceRepository<T>{
  constructor(private readonly prisma: PrismaService) {
  }

  count(): Promise<number> {
    return Promise.resolve(0);
  }

  create(body: any): Promise<T> {
    return Promise.resolve(undefined);
  }

  // @ts-ignore
  async findAll(id: number, skip: number, take: number, search?: string): Promise<ResponsePagination<T>> {
    const [total, data] = await Promise.all([
      this.count(),
      // this.prisma.createMiddleware()
    ]);
  }

  findBy(branchId: number, query: any): Promise<T[]> {
    return Promise.resolve([]);
  }

  findOne(id: number): Promise<T> {
    return Promise.resolve(undefined);
  }

  remove(id: number): void {
  }

  update(id: number, updates: any): Promise<T> {
    return Promise.resolve(undefined);
  }

}
