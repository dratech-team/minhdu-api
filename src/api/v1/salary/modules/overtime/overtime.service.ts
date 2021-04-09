import { Injectable } from "@nestjs/common";
import { BaseService } from "../../../../../core/crud-base/base.service";
import {
  OvertimeSalary,
  OvertimeSalaryDocument,
} from "./schema/overtime-salary.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { Model, Types } from "mongoose";
import { CreateOvertimeSalaryDto } from "./dto/create-overtime-salary.dto";
import { PaginatorOptions } from "../../../../../core/crud-base/interface/pagination.interface";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";
import { UpdateOvertimeSalaryDto } from "./dto/update-overtime-salary.dto";

@Injectable()
export class OvertimeService extends BaseService<OvertimeSalaryDocument> {
  constructor(
    @InjectModel(ModelName.OVERTIME_SALARY)
    private readonly overtimeModel: Model<OvertimeSalaryDocument>
  ) {
    super(overtimeModel);
  }

  async create(
    body: CreateOvertimeSalaryDto,
    ...args
  ): Promise<OvertimeSalary> {
    return super.create(body, ...args);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<OvertimeSalary> {
    return super.findOne(id, ...args);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<OvertimeSalary>> {
    return super.findAll(paginateOpts, ...args);
  }

  async update(
    id: Types.ObjectId,
    updates: UpdateOvertimeSalaryDto,
    ...args
  ): Promise<OvertimeSalary> {
    return super.update(id, updates, ...args);
  }

  async delete(id: Types.ObjectId, ...args): Promise<void> {
    await this.overtimeModel.updateOne({ _id: id }, { deleted: true });
  }
}
