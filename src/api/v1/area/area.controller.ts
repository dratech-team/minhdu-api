import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {AreaEntity} from "./entities/area.entity";
import {AreaService} from "./area.service";
import {CreateAreaDto} from "./dto/create-area.dto";
import {ObjectId} from "mongodb";
import {UpdateAreaDto} from "./dto/update-area.dto";
import {PaginateResult} from "mongoose";

@Controller('v1/area')
export class AreaController {
  constructor(private readonly service: AreaService) {
  }

  @Post()
  async create(@Body() body: CreateAreaDto): Promise<AreaEntity> {
    return this.service.create(body);
  }

  @Get(":id")
  async findById(@Param("id") id: ObjectId): Promise<AreaEntity> {
    return this.service.findById(id);
  }

  @Get()
  async findAll(
    @Query("page", ParseIntPipe) page: number,
    @Query("limit", ParseIntPipe) limit: number
  ): Promise<PaginateResult<AreaEntity>> {
    return this.service.findAll({page, limit});
  }

  @Put(":id")
  async update(
    @Param("id") id: ObjectId,
    @Body() updates: UpdateAreaDto
  ): Promise<AreaEntity> {
    return this.service.update(id, updates);
  }

  @Delete(":id")
  async remove(@Param("id") id: ObjectId): Promise<void> {
    return this.service.remove(id);
  }
}
