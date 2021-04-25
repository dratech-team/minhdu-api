import {Document, FilterQuery, Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {IBaseService} from "./ibase.service";
import {BadRequestException, HttpException, NotFoundException} from "@nestjs/common";
import {PaginatorOptions} from "./interface/pagination.interface";
import {CorePaginateResult} from "../interfaces/pagination";
import {ObjectId} from "mongodb";

export class BaseService<T extends Document> implements IBaseService<T> {
  constructor(@InjectModel("") private model: Model<T>) {
  }

  async create(body: any, ...args: any[]): Promise<any> {
    try {
      return await this.model.create(body);
    } catch (e) {
      throw new BadRequestException(`Không thể tạo ${body}. Vui lòng thử lại. `);
    }
  }

  async update(id: ObjectId, updates: any, ...args: any[]): Promise<any> {
    try {
      return await this.model
        .findByIdAndUpdate(id, updates, {
          new: true,
        }).orFail(new HttpException(`id ${id} Không tìm thấy`, 404)).exec();
    } catch (e) {
      throw new HttpException(e, e.status);
    }
  }

  async remove(id: ObjectId, ...args: any[]): Promise<void> {
    try {

      // @ts-ignore
      await this.model.findByIdAndUpdate(id, {deleted: true}).orFail(new HttpException(`id ${id} Không tìm thấy`, 404));
    } catch (e) {
      throw new HttpException("Server Error" || e, e.status || 500);
    }
  }

  async findById(id: ObjectId): Promise<any> {
    return this.model.findById(id).orFail(new NotFoundException(`id ${id} Không tìm thấy`));
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args: any[]
  ): Promise<CorePaginateResult<any>> {
    // @ts-ignore
    const total = await this.model.countDocuments({deleted: false}).exec();
    try {
      if (paginateOpts && paginateOpts.limit && paginateOpts.page) {
        const skips = paginateOpts.limit * (paginateOpts.page - 1);
        paginateOpts.limit = +paginateOpts.limit;
        const data = await this.model
          .find()
          .skip(skips)
          .limit(paginateOpts.limit)
          .exec();
        return {
          total,
          statusCode: 200,
          isLastPage: paginateOpts.limit * paginateOpts.page > total,
          data: data,
        };
      }
      // @ts-ignore
      const data = await this.model.find({deleted: false}).exec();
      return {total, data};
    } catch (e) {
      throw new HttpException(e.message || e, e.status || 500);
    }
  }

  async findBy(
    query: object,
    paginateOpts?: PaginatorOptions,
    ...args: any[]
  ): Promise<any> {
    try {
      if (paginateOpts && paginateOpts.limit && paginateOpts.page) {
        const skips = paginateOpts.limit * (paginateOpts.page - 1);
        return await this.model
          .find(query)
          .skip(skips)
          .limit(paginateOpts.limit)
          .exec();
      }
      return this.model.find().exec();
    } catch (e) {
      throw new HttpException(e.message || e, e.status || 500);
    }
  }

  async count(args?: any[]): Promise<any> {
    try {
      return await this.model.countDocuments().exec();

    } catch (e) {
      throw new HttpException(e.message || e, e.status || 500);
    }
  }

  async findOne(filter?: FilterQuery<T>): Promise<T> {
    return this.model.findOne(filter);
  }
}
