import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  AllowanceSalary,
  AllowanceSalaryDocument,
} from "./schema/allowance-salary.schema";
import { CreateAllowanceSalaryDto } from "./dto/create-allowance-salary.dto";
import { BasicSalary } from "../basic/schema/basic-salary.schema";
import { BaseService } from "../../../../../core/crud-base/base.service";
import { ModelName } from "../../../../../core/constants/database.constant";
import { PaginatorOptions } from "../../../../../core/crud-base/interface/pagination.interface";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";
// import { PaginatorOptions } from "@/core/crud-base/interface/pagination.interface";
// import { CorePaginateResult } from "@/core/interfaces/pagination";
// import { ModelName } from "@/core/constants/database.constant";
// import { BaseService } from "@/core/crud-base/base.service";

@Injectable()
export class AllowanceService extends BaseService<AllowanceSalaryDocument> {
  constructor(
    @InjectModel(ModelName.ALLOWANCE_SALARY)
    private readonly allowanceModel: Model<AllowanceSalaryDocument>
  ) {
    super(allowanceModel);
  }

  async create(
    payload: CreateAllowanceSalaryDto,
    ...args
  ): Promise<AllowanceSalary> {
    return await super.create(payload, ...args);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<AllowanceSalary> {
    return await super.findOne(id, ...args);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<AllowanceSalary>> {
    return await super.findAll(paginateOpts, ...args);
  }

  async update(id: Types.ObjectId, updates: any, ...args): Promise<any> {
    return await super.update(id, updates, ...args);
  }

  async delete(id: any, ...args): Promise<void> {
    await this.allowanceModel.updateOne({ _id: id }, { deleted: true });
  }

  async allowanceSalaryTotal(): Promise<number> {
    const salaries = await this.findAll();
    const amount = salaries.data
      .map((basicSalary: BasicSalary) => basicSalary.amount)
      .reduce((accumulator, currentValue) => accumulator + currentValue);
    console.log(amount);
    return amount;
  }
}
