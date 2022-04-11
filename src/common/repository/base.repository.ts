import {InterfaceRepository} from "./interface.repository";
import {Response} from "express";
import {ProfileEntity} from "../entities/profile.entity";
import {exportExcel} from "../../core/services/export.service";

export class BaseRepository<T, E> implements InterfaceRepository<T, E> {
  constructor() {
  }

  // count(): Promise<number> {
  //   return Promise.resolve(0);
  // }
  //
  // create(body: any): Promise<T> {
  //   return Promise.resolve(undefined);
  // }
  //
  // async findAll(id: number, skip: number, take: number, search?: string): Promise<ResponsePagination<T>> {
  //   const [total, data] = await Promise.all([
  //     this.count(),
  //     // this.prisma.createMiddleware()
  //   ]);
  // }
  //
  // findBy(branchId: number, query: any): Promise<T[]> {
  //   return Promise.resolve([]);
  // }
  //
  // findOne(id: number): Promise<T> {
  //   return Promise.resolve(undefined);
  // }
  //
  // remove(id: number): void {
  // }
  //
  // update(id: number, updates: any): Promise<T> {
  //   return Promise.resolve(undefined);
  // }

  export(
    response: Response,
    profile: ProfileEntity,
    header: { title: string, filename: string },
    items: any[],
    data: any
  ) {
    const customs = items.reduce((a, v, index) => ({...a, [v['key']]: v['value']}), {});
    return exportExcel(
      response,
      {
        name: header.filename,
        title: header.title,
        customHeaders: Object.values(customs),
        customKeys: Object.keys(customs),
        data: data,
      },
      200
    );
  }

}
