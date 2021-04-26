import {FilterQuery, PaginateResult, Types} from "mongoose";
import {PaginatorOptions} from "./interface/pagination.interface";
import {CorePaginateResult} from "../interfaces/pagination";
import {ObjectId} from "mongodb";
// import { PaginatorOptions } from "@/core/crud-base/interface/pagination.interface";
// import { CorePaginateResult } from "@/core/interfaces/pagination";

export interface IBaseService<ResultType> {
  create(payload: any, ...args: any[]): Promise<ResultType>;

  findAll(
    paginateOpts?: PaginatorOptions,
    ...args: any[]
  ): Promise<PaginateResult<ResultType>>;

  findOne(filter?: FilterQuery<ResultType>): Promise<ResultType>;

  update(id: Types.ObjectId, payload: any, ...args: any[]): Promise<ResultType>;

  remove(id: any, ...args: any[]): Promise<void>;

  findById(id: ObjectId): Promise<ResultType>;

  findBy(
    query: object,
    paginateOpts?: PaginatorOptions,
    ...args: any[]
  ): Promise<ResultType[]>;

  count(args?: any[]): Promise<ResultType>;
}
