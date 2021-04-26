import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {AreaEntity} from "./entities/area.entity";
import {AreaService} from "./area.service";
import {CreateAreaDto} from "./dto/create-area.dto";
import {ObjectId} from "mongodb";
import {UpdateAreaDto} from "./dto/update-area.dto";
import {PaginateOptions, PaginateResult} from "mongoose";

@Controller('v1/area')
export class AreaController {
  constructor(private readonly service: AreaService) {
  }

  @Post()
  async create(@Body() body: CreateAreaDto): Promise<AreaEntity> {
    return this.service.create(body);
  }

  @Get(":id")
  async findOne(@Param("id") id: ObjectId): Promise<AreaEntity> {
    return this.service.findOne(id);
  }

  @Get()
  async findAll(
    @Query("page") page: number,
    @Query("limit") limit: number
  ): Promise<PaginateResult<AreaEntity>> {
    const paginateOpts: PaginateOptions = {
      page: Number(page ?? 1),
      limit: Number(limit ?? 10)
    };
    return await this.service.findAll(paginateOpts);
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
