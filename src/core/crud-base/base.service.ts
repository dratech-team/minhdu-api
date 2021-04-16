import { Document, Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { IBaseService } from "./ibase.service";
import { HttpException } from "@nestjs/common";
import { PaginatorOptions } from "./interface/pagination.interface";
import { CorePaginateResult } from "../interfaces/pagination";
import { ObjectId } from "mongodb";

export class BaseService<T extends Document> implements IBaseService<T> {
  constructor(@InjectModel("") private model: Model<T>) {}

  async create(body: any, ...args: any[]): Promise<any> {
    try {
      const createdItem: any = new this.model(body);
      return await createdItem.save();
    } catch (e) {
      throw new HttpException(e.message || e, e.status || 500);
    }
  }

  async update(id: ObjectId, updates: any, ...args: any[]): Promise<any> {
    try {
      // await this.findOne(id);
      const updated: any = await this.model
        .findByIdAndUpdate(id, updates, {
          new: true,
        })
        .exec();
      console.log(updated);
      return updated;
    } catch (e) {
      throw new HttpException(e.message || e, e.status || 500);
    }
  }

  async delete(id: ObjectId, ...args: any[]): Promise<void> {
    // await this.model.updateOne({ _id: id },{ deleted: true });
    try {
      console.log(typeof this.model.updateOne());
      /*this.model.bulkWrite([{updateOne: {
        filter: {id: id},
          update: {deleted: true}
        }}]).then(res =>{
          console.log(res.modifiedCount);
      });*/
      // @ts-ignore
      await this.model.updateOne({ _id: id }, { deleted: true });
    } catch (e) {
      throw new HttpException("Server Error" || e, e.status || 500);
    }
  }

  async findOne(id: ObjectId, ...args: any[]): Promise<any> {
    try {
      // @ts-ignore
      const item = await this.model.findOne({ _id: id, deleted: false }).exec();
      // const item = await this.model.findById(id).exec();
      if (!item) {
        throw new HttpException("Not found", 404);
      }
      console.log(item);
      return item;
    } catch (e) {
      throw new HttpException("Server Error" || e, e.status || 500);
    }
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args: any[]
  ): Promise<CorePaginateResult<any>> {
    const total = await this.model.countDocuments();
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
      const data = await this.model.find({ deleted: false }).exec();
      return { total, data };
    } catch (e) {
      throw new HttpException(e.message || e, e.status || 500);
    }
  }

  async findOneBy(query: object, ...args: any[]): Promise<any> {
    try {
      const item = await this.model.findOne(query).exec();
      if (!item) {
        throw new HttpException("Not found", 404);
      }
      return item;
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
}
