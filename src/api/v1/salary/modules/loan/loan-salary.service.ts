import { Injectable } from "@nestjs/common";
import { BaseService } from "../../../../../core/crud-base/base.service";
import { LoanSalary, LoanSalaryDocument } from "./schema/loan-salary.schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { CreateLoanSalaryDto } from "./dto/create-loan-salary.dto";
import { PaginatorOptions } from "../../../../../core/crud-base/interface/pagination.interface";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";

@Injectable()
export class LoanSalaryService extends BaseService<LoanSalaryDocument> {
  constructor(
    @InjectModel(ModelName.LOAN_SALARY)
    private readonly loanModel: Model<LoanSalaryDocument>
  ) {
    super(loanModel);
  }

  async create(payload: CreateLoanSalaryDto, ...args): Promise<LoanSalary> {
    return super.create(payload, ...args);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<LoanSalary> {
    return super.findOne(id, ...args);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<LoanSalary>> {
    return super.findAll(paginateOpts, ...args);
  }

  async update(id: Types.ObjectId, updates: any, ...args): Promise<LoanSalary> {
    return super.update(id, updates, ...args);
  }

  async delete(id: Types.ObjectId, ...args): Promise<void> {
    await this.loanModel.updateOne({ _id: id }, { deleted: true });
  }

  async loanSalaryTotal(): Promise<number> {
    const salaries = await this.findAll();
    return salaries.data.map((e) => e.price).reduce((x, y) => x + y);
  }
}
