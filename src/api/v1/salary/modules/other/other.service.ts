import { Injectable } from "@nestjs/common";
import { BaseService } from "../../../../../core/crud-base/base.service";
import { OtherSalary, OtherSalaryDocument } from "./schema/other-salary.schema";
import { Model, Types } from "mongoose";
import { CreateDeductionSalaryDto } from "../deduction/dto/create-deduction-salary.dto";
import { PaginatorOptions } from "../../../../../core/crud-base/interface/pagination.interface";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";
import { UpdateOtherSalaryDto } from "./dto/update-other-salary.dto";
import { OtherType } from "./other-type.enum";
import { OtherSalaryInterface } from "./interface/other-salary.interface";

@Injectable()
export class OtherService extends BaseService<OtherSalaryDocument> {
  constructor(private readonly otherModel: Model<OtherSalaryDocument>) {
    super(otherModel);
  }

  async create(body: CreateDeductionSalaryDto, ...args): Promise<OtherSalary> {
    return super.create(body, ...args);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<OtherSalary> {
    return super.findOne(id, ...args);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<OtherSalary>> {
    return super.findAll(paginateOpts, ...args);
  }

  async update(
    id: Types.ObjectId,
    updates: UpdateOtherSalaryDto,
    ...args
  ): Promise<OtherSalary> {
    return super.update(id, updates, ...args);
  }

  async delete(id: Types.ObjectId, ...args): Promise<void> {
    await this.otherModel.updateOne({ _id: id }, { deleted: true });
  }

  async otherSalaryTotal(type: OtherType): Promise<OtherSalaryInterface> {
    const salaries = await this.findAll();
    let amount = salaries.data
      .filter((e) => e.type === type)
      .map((a) => a.price)
      .reduce((previousValue, currentValue) => previousValue + currentValue);

    return { amount, type };
  }
}
