import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateBranchDto} from './dto/create-branch.dto';
import {UpdateBranchDto} from './dto/update-branch.dto';
import {PaginateModel, PaginateOptions, PaginateResult} from "mongoose";
import {BranchDocument, BranchEntity} from "./entities/branch.entity";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {ObjectId} from "mongodb";
import {generateId} from "../../../common/utils/generate-id.utils";

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(ModelName.BRANCH)
    private readonly model: PaginateModel<BranchDocument>) {
  }

  async create(body: CreateBranchDto): Promise<BranchEntity> {
    const payload = {
      name: body.name,
      code: generateId(body.name),
      areaId: body.areaId,
    };
    try {
      return await this.model.create(payload);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findById(id: ObjectId): Promise<BranchEntity> {
    return this.model.findById(id);
  }

  async findAll(paginateOpts?: PaginateOptions): Promise<PaginateResult<BranchEntity>> {
    paginateOpts.populate = ['departmentIds'];
    try {
      return await this.model.paginate({deleted: false}, paginateOpts);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAllAreas(
    id: ObjectId,
    paginateOpts?: PaginateOptions
  ): Promise<PaginateResult<BranchEntity>> {
    try {
      return await this.model.paginate({areaId: id}, paginateOpts);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(id: ObjectId, updates: UpdateBranchDto): Promise<BranchEntity> {
    const payload = new BranchEntity();
    payload.name = updates.name;
    payload.code = generateId(updates.name);
    payload.departmentIds = updates.departmentIds;
    payload.areaId = updates.areaId;

    return this.model.findByIdAndUpdate(id, payload).orFail(new NotFoundException());
  }

  async remove(id: ObjectId): Promise<void> {
    this.model.findByIdAndDelete(id).orFail(new NotFoundException());
  }

  async updateDepartmentToBranch(departmentId: ObjectId, branchIds: ObjectId[]): Promise<any> {
    for (let i = 0; i < branchIds.length; i++) {
      await this.model.findByIdAndUpdate(
        {_id: branchIds[i]},
        {"$addToSet": {departmentIds: departmentId}}
      ).lean();
    }
  }
}
