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
import { PositionEntity } from "./entities/position.entity";
import { PositionService } from "./position.service";
import { CreatePositionDto } from "./dto/create-position.dto";
import { Types } from "mongoose";
import { CorePaginateResult } from "../../../core/interfaces/pagination";
import { UpdatePositionDto } from "./dto/update-position.dto";
import { ObjectId } from "mongodb";

@Controller("v1/position")
export class PositionController extends BaseController<PositionEntity> {
  constructor(private readonly service: PositionService) {
    super(service);
  }

  @Post()
  async create(@Body() body: CreatePositionDto, ...args): Promise<PositionEntity> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findOne(@Param("id") id: ObjectId, ...args): Promise<PositionEntity> {
    return super.findOne(id, ...args);
  }

  @Get()
  async findAll(
    @Param("number") page: number,
    @Param("limit") limit: number,
    ...args
  ): Promise<CorePaginateResult<PositionEntity>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(
    @Body() updates: UpdatePositionDto,
    @Param("id") id: ObjectId,
    ...args
  ): Promise<PositionEntity> {
    return super.update(updates, id, ...args);
  }

  @Delete(":id")
  async remove(@Param("id") id: ObjectId, ...args): Promise<void> {
    return super.remove(id, ...args);
  }
}
