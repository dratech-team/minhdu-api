import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {BasicSalaryEntity, BasicSalaryDocument} from "./entities/basic-salary.schema";
import {UpdateBasicSalaryDto} from "./dto/update-basic-salary.dto";
import {BaseService} from "../../../../../core/crud-base/base.service";
import {ModelName} from "../../../../../common/constant/database.constant";
import {PaginatorOptions} from "../../../../../core/crud-base/interface/pagination.interface";
import {CorePaginateResult} from "../../../../../core/interfaces/pagination";

@Injectable()
export class BasicSalaryService extends BaseService<BasicSalaryDocument> {
  constructor(
    @InjectModel(ModelName.BASIC_SALARY)
    private readonly basicSalaryModel: Model<BasicSalaryDocument>
  ) {
    super(basicSalaryModel);
  }

  create(payload: any, ...args): Promise<BasicSalaryEntity> {
    return super.create(payload, ...args);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<any> {
    return await super.findOne(id, ...args);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<BasicSalaryEntity>> {
    return await super.findAll(paginateOpts, ...args);
  }

  async update(
    id: Types.ObjectId,
    updates: UpdateBasicSalaryDto,
    ...args
  ): Promise<BasicSalaryEntity> {
    return await super.update(id, updates, ...args);
  }

  async remove(id: Types.ObjectId, ...args): Promise<void> {
    return await super.remove(id, ...args);
  }

  async basicSalaryTotal(): Promise<number> {
    const salaries = await this.findAll();
    return salaries.data
      .map((e) => e.price)
      .reduce((previousValue, currentValue) => previousValue + currentValue);
  }
}
