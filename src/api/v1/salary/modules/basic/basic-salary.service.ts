import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BasicSalary, BasicSalaryDocument } from "./schema/basic-salary.schema";
import { UpdateBasicSalaryDto } from "./dto/update-basic-salary.dto";
import { BaseService } from "../../../../../core/crud-base/base.service";
import { ModelName } from "../../../../../common/constant/database.constant";
import { MyLoggerService } from "../../../../../core/services/mylogger.service";
import { PaginatorOptions } from "../../../../../core/crud-base/interface/pagination.interface";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";

@Injectable()
export class BasicSalaryService extends BaseService<BasicSalaryDocument> {
  constructor(
    @InjectModel(ModelName.BASIC_SALARY)
    private readonly basicSalaryModel: Model<BasicSalaryDocument>,
    private readonly logService: MyLoggerService
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
}
