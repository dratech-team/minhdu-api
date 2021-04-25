import {Injectable} from '@nestjs/common';
import {CreateBranchDto} from './dto/create-branch.dto';
import {UpdateBranchDto} from './dto/update-branch.dto';
import {BaseService} from "../../../core/crud-base/base.service";
import {Model} from "mongoose";
import {BranchDocument, BranchEntity} from "./entities/branch.entity";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {PaginatorOptions} from "../../../core/crud-base/interface/pagination.interface";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {ObjectId} from "mongodb";
import {generateId} from "../../../common/utils/generate-id.utils";

@Injectable()
export class BranchService extends BaseService<BranchDocument> {
  constructor(
    @InjectModel(ModelName.BRANCH)
    private readonly branchModel: Model<BranchDocument>) {
    super(branchModel);
  }

  async create(body: CreateBranchDto): Promise<BranchEntity> {
    const payload = {
      name: body.name,
      code: generateId(body.name),
    };
    return await super.create(payload);
  }

  async findAll(paginateOpts?: PaginatorOptions, ...args): Promise<CorePaginateResult<BranchEntity>> {
    return super.findAll(paginateOpts, ...args);
  }

  async update(id: ObjectId, updates: UpdateBranchDto, ...args): Promise<BranchEntity> {
    const payload = new BranchEntity();
    payload.name = updates.name;
    payload.code = generateId(updates.name);
    payload.departmentIds = updates.departmentIds;

    return super.update(id, payload, ...args);
  }

  async remove(id: ObjectId): Promise<void> {
    return super.delete(id);
  }

  async updateDepartmentToBranch(departmentId: ObjectId, branchIds: ObjectId[]): Promise<any> {
    for (let i = 0; i < branchIds.length; i++) {
      await this.branchModel.findByIdAndUpdate(
        {_id: branchIds[i]},
        {"$addToSet": {departmentIds: departmentId}}
      ).lean();
    }
  }
}
