import {ResponsePagination} from "../entities/response.pagination";
import {DeleteMultipleSalaryDto} from "../../api/v2/salaries/base/dto/delete-multiple-salary.dto";

export interface InterfaceRepository<T> {
  create(body: any): Promise<T>;

  createMany(body: Array<any>): Promise<{ count: number }>;

  findAll(search?: any): Promise<ResponsePagination<T>>;

  findOne(id: number): Promise<T>;

  update(id: number, updates: any): Promise<T>;

  updateMany(ids: number[], updates: any): Promise<{ count: number }>;

  remove(id: number): Promise<T>;

  removeMany(body: any): Promise<{ count: number }>;
}
