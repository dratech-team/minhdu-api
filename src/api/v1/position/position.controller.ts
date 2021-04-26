import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put,} from "@nestjs/common";
import {PositionEntity} from "./entities/position.entity";
import {PositionService} from "./position.service";
import {CreatePositionDto} from "./dto/create-position.dto";
import {PaginateResult} from "mongoose";
import {UpdatePositionDto} from "./dto/update-position.dto";
import {ObjectId} from "mongodb";

@Controller("v1/position")
export class PositionController {
  constructor(private readonly service: PositionService) {
  }

  @Post()
  async create(@Body() body: CreatePositionDto): Promise<PositionEntity> {
    return this.service.create(body);
  }

  @Get(":id")
  async findOne(@Param("id") id: ObjectId): Promise<PositionEntity> {
    return this.service.findById(id);
  }

  @Get()
  async findAll(
    @Param("number", ParseIntPipe) page: number,
    @Param("limit", ParseIntPipe) limit: number,
  ): Promise<PaginateResult<PositionEntity>> {
    return this.service.findAll({page, limit});
  }

  @Put(":id")
  async update(
    @Param("id") id: ObjectId,
    @Body() updates: UpdatePositionDto,
  ): Promise<PositionEntity> {
    return this.service.update(id, updates);
  }

  @Delete(":id")
  async remove(@Param("id") id: ObjectId): Promise<void> {
    return this.service.remove(id);
  }
}
