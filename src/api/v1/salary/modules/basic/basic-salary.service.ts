import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BasicSalary, BasicSalaryDocument } from "./entities/basic-salary.entity";
import { UpdateBasicSalaryDto } from "./dto/update-basic-salary.dto";
import { BaseService } from "../../../../../core/crud-base/base.service";
import { ModelName } from "../../../../../common/constant/database.constant";
import { PaginatorOptions } from "../../../../../core/crud-base/interface/pagination.interface";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";

@Injectable()
export class BasicSalaryService extends BaseService<BasicSalaryDocument> {
  constructor(
    @InjectModel(ModelName.BASIC_SALARY)
    private readonly basicSalaryModel: Model<BasicSalaryDocument>
  ) {
    super(basicSalaryModel);
  }

  create(payload: any, ...args): Promise<BasicSalary> {
    return super.create(payload, ...args);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<any> {
    return await super.findOne(id, ...args);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<BasicSalary>> {
    return await super.findAll(paginateOpts, ...args);
  }

  async update(
    id: Types.ObjectId,
    updates: UpdateBasicSalaryDto,
    ...args
  ): Promise<BasicSalary> {
    return await super.update(id, updates, ...args);
  }

  async delete(id: Types.ObjectId, ...args): Promise<void> {
    await this.basicSalaryModel.updateOne({ _id: id }, { deleted: true });
  }

  async basicSalaryTotal(): Promise<number> {
    const salaries = await this.findAll();
    return salaries.data
      .map((e) => e.price)
      .reduce((previousValue, currentValue) => previousValue + currentValue);
  }
}
