import { Injectable } from "@nestjs/common";
import { BaseService } from "../../../core/crud-base/base.service";
import { Position, PositionDocument } from "./schema/position.schema";
import { Model, Types } from "mongoose";
import { CreatePositionDto } from "./dto/create-position.dto";
import { PaginatorOptions } from "../../../core/crud-base/interface/pagination.interface";
import { CorePaginateResult } from "../../../core/interfaces/pagination";
import { UpdatePositionDto } from "./dto/update-position.dto";
import { InjectModel } from "@nestjs/mongoose";
import { ModelName } from "../../../common/constant/database.constant";

@Injectable()
export class PositionService extends BaseService<PositionDocument> {
  constructor(
    @InjectModel(ModelName.POSITION)
    private readonly positionModel: Model<PositionDocument>
  ) {
    super(positionModel);
  }

  async create(body: CreatePositionDto, ...args): Promise<Position> {
    return super.create(body, ...args);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<Position> {
    return super.findOne(id, ...args);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<Position>> {
    return super.findAll(paginateOpts, ...args);
  }

  async update(
    id: Types.ObjectId,
    updates: UpdatePositionDto,
    ...args
  ): Promise<Position> {
    return super.update(id, updates, ...args);
  }

  async delete(id: Types.ObjectId, ...args): Promise<void> {
    await this.positionModel.updateOne({ _id: id }, { deleted: true });
  }
}
