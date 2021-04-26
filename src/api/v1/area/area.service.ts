import {BadRequestException, HttpException, Injectable, NotFoundException} from '@nestjs/common';
import {AreaDocument, AreaEntity} from "./entities/area.entity";
import {PaginateModel, PaginateOptions, PaginateResult} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {CreateAreaDto} from "./dto/create-area.dto";
import {ObjectId} from "mongodb";
import {UpdateAreaDto} from "./dto/update-area.dto";

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(ModelName.AREA)
    private readonly model: PaginateModel<AreaDocument>,
  ) {
  }

  async create(body: CreateAreaDto): Promise<AreaEntity> {
    try {
      return await this.model.create(body);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(id: ObjectId): Promise<any> {
    return this.model.findOne({_id: id, deleted: false});
  }

  async findAll(
    paginateOpts?: PaginateOptions
  ): Promise<PaginateResult<AreaEntity>> {
    try {
      return await this.model.paginate({deleted: false}, paginateOpts);
    } catch (e) {
      throw new HttpException(e, e.statusCode);
    }
  }

  async update(id: ObjectId, updates: UpdateAreaDto): Promise<any> {
    return this.model.findByIdAndUpdate(id, updates).orFail(new NotFoundException());
  }

  async remove(id: ObjectId): Promise<void> {
    this.model.findByIdAndUpdate(id, {deleted: true}).orFail(new NotFoundException());
  }
}
