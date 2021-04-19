import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { BaseController } from "../../../../../core/crud-base/base-controller";
import { OtherSalaryEntity } from "./entities/other-salary.schema";
import { OtherService } from "./other.service";
import { CreateOtherSalaryDto } from "./dto/create-other-salary";
import { Types } from "mongoose";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";
import { UpdateOtherSalaryDto } from "./dto/update-other-salary.dto";

@Controller("other")
export class OtherController extends BaseController<OtherSalaryEntity> {
  constructor(private readonly service: OtherService) {
    super(service);
  }

  @Post()
  async create(
    @Body() body: CreateOtherSalaryDto,
    ...args
  ): Promise<OtherSalaryEntity> {
    return super.create(body, ...args);
  }

  @Get("id")
  async findById(
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<OtherSalaryEntity> {
    return super.findById(id, ...args);
  }

  @Get()
  async findAll(
    @Param("page") page: number,
    @Param("limit") limit: number,
    ...args
  ): Promise<CorePaginateResult<OtherSalaryEntity>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(
    @Body() updates: UpdateOtherSalaryDto,
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<OtherSalaryEntity> {
    return super.update(updates, id, ...args);
  }

  @Delete(":id")
  async delete(@Param("id") id: Types.ObjectId, ...args): Promise<void> {
    return super.delete(id, ...args);
  }
}
