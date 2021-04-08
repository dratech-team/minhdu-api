import { Types } from "mongoose";
import { PaginatorOptions } from "@/crud-base/interface/pagination.interface";

export interface IBaseService<ResultType> {
  create(payload: any, ...args: any[]): Promise<ResultType>;

  findAll(
    paginateOpts?: PaginatorOptions,
    ...args: any[]
  ): Promise<ResultType[]>;

  findOne(id: any, ...args: any[]): Promise<ResultType>;

  findOneBy(query: object, ...args: any[]): Promise<ResultType>;

  findBy(
    query: object,
    paginateOpts?: PaginatorOptions,
    ...args: any[]
  ): Promise<ResultType[]>;

  update(id: Types.ObjectId, payload: any, ...args: any[]): Promise<ResultType>;

  delete(id: any, ...args: any[]): Promise<void>;
}
