import {ResponsePagination} from "../entities/response.pagination";

export interface InterfaceRepository<T> {
  create(body: any): Promise<T>;

  count(query?: any): Promise<number>;

  findAll(id: number, skip: number, take: number, search?: string): Promise<ResponsePagination<T>>;

  findBy(branchId: number, query: any): Promise<T[]>;

  findOne(id: number): Promise<T>;

  update(id: number, updates: any): Promise<T>;

  remove(id: number): void;
}
