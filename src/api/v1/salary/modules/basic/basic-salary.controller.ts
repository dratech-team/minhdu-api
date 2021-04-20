import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { BasicSalaryEntity } from "./entities/basic-salary.schema";
import { CreateBasicSalaryDto } from "./dto/create-basic-salary.dto";
import { BasicSalaryService } from "./basic-salary.service";
import { Types } from "mongoose";
import { UpdateBasicSalaryDto } from "./dto/update-basic-salary.dto";
import { BaseController } from "../../../../../core/crud-base/base-controller";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";

@Controller("v1/salary/basic")
export class BasicSalaryController extends BaseController<BasicSalaryEntity> {
  constructor(private readonly service: BasicSalaryService) {
    super(service);
  }

  @Post()
  async create(
    @Body() body: CreateBasicSalaryDto,
    ...args
  ): Promise<BasicSalaryEntity> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findOne(
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<BasicSalaryEntity> {
    return super.findOne(id, ...args);
  }

  @Get()
  async findAll(
    page: number,
    limit: number,
    ...args
  ): Promise<CorePaginateResult<BasicSalaryEntity>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(
    @Body() body: UpdateBasicSalaryDto,
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<BasicSalaryEntity> {
    return super.update(body, id, ...args);
  }

  @Delete(":id")
  async remove(@Param("id") id: Types.ObjectId, ...args): Promise<void> {
    return super.remove(id, ...args);
  }
}
