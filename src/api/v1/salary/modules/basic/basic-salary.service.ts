import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ModelName } from "@/constants/database.constant";
import { Model, Types } from "mongoose";
import { BasicSalary, BasicSalaryDocument } from "./schema/basic-salary.schema";
import { BaseService } from "@/crud-base/base.service";
import { PaginatorOptions } from "@/crud-base/interface/pagination.interface";
import { UpdateBasicSalaryDto } from "./dto/update-basic-salary.dto";
import { CorePaginateResult } from "@/interfaces/pagination";

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
  ): Promise<CorePaginateResult> {
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
    const basicSalaries = await this.findAll();
    const amount = basicSalaries.data
      .map((basicSalary: BasicSalary) => basicSalary.amount)
      .reduce((accumulator, currentValue) => accumulator + currentValue);
    console.log(amount);
    return amount;
  }
}
