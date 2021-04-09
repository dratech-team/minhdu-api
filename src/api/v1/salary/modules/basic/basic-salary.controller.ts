import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { BasicSalary } from "./schema/basic-salary.schema";
import { CreateBasicSalaryDto } from "./dto/create-basic-salary.dto";
import { BasicSalaryService } from "./basic-salary.service";
import { Types } from "mongoose";
import { UpdateBasicSalaryDto } from "./dto/update-basic-salary.dto";
import { BaseController } from "../../../../../core/crud-base/base-controller";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";

@Controller("v1/salary/basic")
export class BasicSalaryController extends BaseController<BasicSalary> {
  constructor(private readonly service: BasicSalaryService) {
    super(service);
  }

  @Post()
  async create(
    @Body() body: CreateBasicSalaryDto,
    ...args
  ): Promise<BasicSalary> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findById(
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<BasicSalary> {
    return super.findById(id, ...args);
  }

  @Get()
  async findAll(
    page: number,
    limit: number,
    ...args
  ): Promise<CorePaginateResult<BasicSalary>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(
    @Body() body: UpdateBasicSalaryDto,
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<BasicSalary> {
    return super.update(body, id, ...args);
  }

  @Delete(":id")
  async delete(@Param("id") id: Types.ObjectId, ...args): Promise<void> {
    return super.delete(id, ...args);
  }
}
