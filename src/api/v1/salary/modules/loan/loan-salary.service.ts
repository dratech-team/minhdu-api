import { Injectable } from "@nestjs/common";
import { BaseService } from "../../../../../core/crud-base/base.service";
import { LoanSalaryEntity, LoanSalaryDocument } from "./entities/loan-salary.schema";
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

  async create(payload: CreateLoanSalaryDto, ...args): Promise<LoanSalaryEntity> {
    return super.create(payload, ...args);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<LoanSalaryEntity> {
    return super.findOne(id, ...args);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<LoanSalaryEntity>> {
    return super.findAll(paginateOpts, ...args);
  }

  async update(id: Types.ObjectId, updates: any, ...args): Promise<LoanSalaryEntity> {
    return super.update(id, updates, ...args);
  }

  async remove(id: Types.ObjectId, ...args): Promise<void> {
    return await super.remove(id, ...args);
  }

  async loanSalaryTotal(): Promise<number> {
    const salaries = await this.findAll();
    return salaries.data.map((e) => e.price).reduce((x, y) => x + y);
  }
}
