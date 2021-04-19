import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { BaseController } from "../../../core/crud-base/base-controller";
import { Position } from "./entities/position.schema";
import { PositionService } from "./position.service";
import { CreatePositionDto } from "./dto/create-position.dto";
import { Types } from "mongoose";
import { CorePaginateResult } from "../../../core/interfaces/pagination";
import { UpdatePositionDto } from "./dto/update-position.dto";
import { ObjectId } from "mongodb";

@Controller("v1/position")
export class PositionController extends BaseController<Position> {
  constructor(private readonly service: PositionService) {
    super(service);
  }

  @Post()
  async create(@Body() body: CreatePositionDto, ...args): Promise<Position> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findById(@Param("id") id: ObjectId, ...args): Promise<Position> {
    return super.findById(id, ...args);
  }

  @Get()
  async findAll(
    @Param("number") page: number,
    @Param("limit") limit: number,
    ...args
  ): Promise<CorePaginateResult<Position>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(
    @Body() updates: UpdatePositionDto,
    @Param("id") id: ObjectId,
    ...args
  ): Promise<Position> {
    return super.update(updates, id, ...args);
  }

  @Delete(":id")
  async delete(@Param("id") id: ObjectId, ...args): Promise<void> {
    return super.delete(id, ...args);
  }
}
