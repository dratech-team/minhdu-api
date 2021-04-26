import {Document, FilterQuery, Model, PaginateModel, PaginateResult} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {IBaseService} from "./ibase.service";
import {BadRequestException, HttpException, NotFoundException} from "@nestjs/common";
import {PaginatorOptions} from "./interface/pagination.interface";
import {CorePaginateResult} from "../interfaces/pagination";
import {ObjectId} from "mongodb";

export class BaseService<T extends Document> implements IBaseService<T> {
  constructor(@InjectModel("") private model: PaginateModel<T>) {
  }

  async create(body: any, ...args: any[]): Promise<any> {
    try {
      return await this.model.create(body);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(id: ObjectId, updates: any, ...args: any[]): Promise<any> {
    try {
      return this.model
        .findByIdAndUpdate(id, updates, {new: true})
        .orFail(new NotFoundException(`id ${id} Không tìm thấy`));

    } catch (e) {
      throw new HttpException(e, e.status);
    }
  }

  async remove(id: ObjectId, ...args: any[]): Promise<void> {
    try {
      // @ts-ignore
      await this.model.findOneAndUpdate({_id: _id}, {deleted: true})
        .orFail(new NotFoundException(`id ${id} Không tìm thấy`));
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async delete(id: ObjectId): Promise<void> {
    try {
      await this.model.findByIdAndDelete(id)
        .orFail(new NotFoundException(`id ${id} Không tìm thấy`));
    } catch (e) {
      throw new BadRequestException(e);
    }
  }


  async findById(id: ObjectId): Promise<any> {
    return this.model.findById(id).orFail(new NotFoundException(`id ${id} Không tìm thấy`));
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args: any[]
  ): Promise<PaginateResult<any>> {
    try {
      return await this.model.paginate({deleted: false}, paginateOpts);
    } catch (e) {
      throw new BadRequestException(e);
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
