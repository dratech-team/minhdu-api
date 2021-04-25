import {Injectable} from "@nestjs/common";
import {BaseService} from "../../../core/crud-base/base.service";
import {PositionEntity, PositionDocument} from "./entities/position.entity";
import {Model, Types} from "mongoose";
import {CreatePositionDto} from "./dto/create-position.dto";
import {PaginatorOptions} from "../../../core/crud-base/interface/pagination.interface";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {UpdatePositionDto} from "./dto/update-position.dto";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";

@Injectable()
export class PositionService extends BaseService<PositionDocument> {
  constructor(
    @InjectModel(ModelName.POSITION)
    private readonly positionModel: Model<PositionDocument>,
  ) {
    super(positionModel);
  }

  async create(body: CreatePositionDto, ...args): Promise<PositionEntity> {

    return super.create(body, ...args);
  }
  //
  // async findOne(id: Types.ObjectId): Promise<PositionEntity> {
  //   return super.findOne(id);
  // }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<PositionEntity>> {
    return super.findAll(paginateOpts, ...args);
  }

  async update(
    id: Types.ObjectId,
    updates: UpdatePositionDto,
    ...args
  ): Promise<PositionEntity> {

    return super.update(id, updates, ...args);
  }

  async remove(id: Types.ObjectId, ...args): Promise<void> {
    return await super.remove(id, ...args);
  }
}
