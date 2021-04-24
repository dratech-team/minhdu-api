import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {
  AllowanceSalaryEntity,
  AllowanceSalaryDocument,
} from "./entities/allowance-salary.schema";
import {CreateAllowanceSalaryDto} from "./dto/create-allowance-salary.dto";
import {BaseService} from "../../../core/crud-base/base.service";
import {ModelName} from "../../../common/constant/database.constant";
import {PaginatorOptions} from "../../../core/crud-base/interface/pagination.interface";
import {CorePaginateResult} from "../../../core/interfaces/pagination";

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
  ): Promise<AllowanceSalaryEntity> {
    return await super.create(payload, ...args);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<AllowanceSalaryEntity> {
    return await super.findOne(id, ...args);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<AllowanceSalaryEntity>> {
    return await super.findAll(paginateOpts, ...args);
  }

  async update(id: Types.ObjectId, updates: any, ...args): Promise<any> {
    return await super.update(id, updates, ...args);
  }

  async remove(id: any, ...args): Promise<void> {
    return await super.remove(id, ...args);
  }

  async allowanceSalaryTotal(): Promise<number> {
    const salaries = await this.findAll();
    return salaries.data
      .map((e) => e.price)
      .reduce((previousValue, currentValue) => previousValue + currentValue);
  }
}