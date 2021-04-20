import { Injectable } from "@nestjs/common";
import { BaseService } from "../../../../../core/crud-base/base.service";
import {
  DeductionSalaryEntity,
  DeductionSalaryDocument,
} from "./entities/deduction-salary.schema";
import { Model, Types } from "mongoose";
import { CreateDeductionSalaryDto } from "./dto/create-deduction-salary.dto";
import { PaginatorOptions } from "../../../../../core/crud-base/interface/pagination.interface";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";
import { AbsentType } from "./absent-type.enum";
import { InjectModel } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";

@Injectable()
export class DeductionService extends BaseService<DeductionSalaryDocument> {
  constructor(
    @InjectModel(ModelName.DEDUCTION_SALARY)
    private readonly deductionModel: Model<DeductionSalaryDocument>
  ) {
    super(deductionModel);
  }

  async create(
    payload: CreateDeductionSalaryDto,
    ...args
  ): Promise<DeductionSalaryEntity> {
    return super.create(payload, ...args);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<DeductionSalaryEntity> {
    return super.findOne(id, ...args);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<DeductionSalaryEntity>> {
    return super.findAll(paginateOpts, ...args);
  }

  async update(
    id: Types.ObjectId,
    updates: any,
    ...args
  ): Promise<DeductionSalaryEntity> {
    return super.update(id, updates, ...args);
  }

  async remove(id: Types.ObjectId, ...args): Promise<void> {
    return await super.remove(id, ...args);
  }

  /**
   * 1: 1 ngày / 1 giờ
   * 0.5: nửa ngày / nửa giờ
   * .......
   * - Nếu AbsentType là PAID_LEAVE thì sẽ lấy tiền 1 ngày công x số ngày nghỉ
   * - Nếu AbsentType là UNPAID_LEAVE thì sẽ lấy tiền 1 ngày công x số ngày nghỉ x 1.5
   * */
  async deductionSalaryTotal(): Promise<number> {
    const salaries = await this.findAll();
    let amount: number = 0;

    for (let i = 0; i < salaries.data.length; i++) {
      if (salaries.data[i].type === AbsentType.UNPAID_LEAVE) {
        amount += (salaries.data[i].price / 26) * salaries.data[i].times;
      } else if (salaries.data[i].type === AbsentType.LATE) {
        amount += (salaries.data[i].price / 26 / 8) * salaries.data[i].times;
      }
    }
    return amount;
  }
}
