import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {BaseController} from "../../../core/crud-base/base-controller";
import {AreaEntity} from "./entities/areaSchema";
import {AreaService} from "./area.service";
import {CreateAreaDto} from "./dto/create-area.dto";
import {ObjectId} from "mongodb";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {UpdateAreaDto} from "./dto/update-area.dto";

@Controller('v1/area')
export class AreaController extends BaseController<AreaEntity> {
  constructor(private readonly service: AreaService) {
    super(service);
  }

  @Post()
  async create(@Body() body: CreateAreaDto, ...args): Promise<AreaEntity> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findOne(@Param("id") id: ObjectId, ...args): Promise<AreaEntity> {
    return super.findOne(id, ...args);
  }

  @Get()
  async findAll(@Param("page") page: number, @Param("limit") limit: number, ...args): Promise<CorePaginateResult<AreaEntity>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(@Body() updates: UpdateAreaDto, @Param("id") id: ObjectId, ...args): Promise<AreaEntity> {
    return super.update(updates, id, ...args);
  }

  @Delete(":id")
  async delete(@Param("id") id: ObjectId, ...args): Promise<void> {
    return super.delete(id, ...args);
  }
}
