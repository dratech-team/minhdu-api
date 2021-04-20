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

@Injectable()
export class BranchService extends BaseService<BranchDocument> {
  constructor(
    @InjectModel(ModelName.BRANCH)
    private readonly branchService: Model<BranchDocument>) {
    super(branchService);
  }

  create(body: CreateBranchDto): Promise<BranchEntity> {
    return super.create(body);
  }

  async findAll(paginateOpts?: PaginatorOptions, ...args): Promise<CorePaginateResult<BranchEntity>> {
    return super.findAll(paginateOpts, ...args);
  }

  async findOne(id: ObjectId, ...args): Promise<BranchEntity> {
    return super.findOne(id, ...args);
  }

  async update(id: ObjectId, updates: UpdateBranchDto, ...args): Promise<BranchEntity> {
    return super.update(id, updates, ...args);
  }

  async remove(id: ObjectId, ...args): Promise<void> {
    return super.remove(id, ...args);
  }
}
