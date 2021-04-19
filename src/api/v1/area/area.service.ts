import {Injectable} from '@nestjs/common';
import {BaseService} from "../../../core/crud-base/base.service";
import {Area, AreaDocument} from "./schema/area.schema";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {CreateAreaDto} from "./dto/create-area.dto";
import {ObjectId} from "mongodb";
import {PaginatorOptions} from "../../../core/crud-base/interface/pagination.interface";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {UpdateAreaDto} from "./dto/update-area.dto";

@Injectable()
export class AreaService extends BaseService<AreaDocument> {
  constructor(
    @InjectModel(ModelName.AREA)
    private readonly areaModel: Model<AreaDocument>,
  ) {
    super(areaModel);
  }

  //TODO: handle generate code
  async create(body: CreateAreaDto, ...args): Promise<Area> {
    return super.create(body, ...args);
  }

  async findOne(id: ObjectId, ...args): Promise<Area> {
    return super.findOne(id, ...args);
  }

  async findAll(paginateOpts?: PaginatorOptions, ...args): Promise<CorePaginateResult<Area>> {
    return super.findAll(paginateOpts, ...args);
  }

  async update(id: ObjectId, updates: UpdateAreaDto, ...args): Promise<any> {
    return super.update(id, updates, ...args);
  }

  async delete(id: ObjectId, ...args): Promise<void> {
    return super.delete(id, ...args);
  }
}
