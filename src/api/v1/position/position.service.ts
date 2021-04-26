import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PositionDocument, PositionEntity} from "./entities/position.entity";
import {PaginateModel, PaginateOptions, PaginateResult, Types} from "mongoose";
import {CreatePositionDto} from "./dto/create-position.dto";
import {UpdatePositionDto} from "./dto/update-position.dto";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {ObjectId} from "mongodb";

@Injectable()
export class PositionService {
  constructor(
    @InjectModel(ModelName.POSITION)
    private readonly model: PaginateModel<PositionDocument>,
  ) {
  }

  async create(body: CreatePositionDto): Promise<PositionEntity> {
    try {
      return await this.model.create(body);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findById(id: ObjectId): Promise<PositionEntity> {
    return this.model.findById(id);
  }

  async findAll(
    paginateOpts?: PaginateOptions,
  ): Promise<PaginateResult<PositionEntity>> {
    return this.model.paginate(paginateOpts);
  }

  async update(
    id: ObjectId,
    updates: UpdatePositionDto,
  ): Promise<PositionEntity> {
    return this.model
      .findByIdAndUpdate(id, {updates})
      .orFail(new NotFoundException());
  }

  async remove(id: Types.ObjectId): Promise<void> {
    this.model
      .findByIdAndUpdate(id, {deleted: true})
      .orFail(new NotFoundException());
  }
}
