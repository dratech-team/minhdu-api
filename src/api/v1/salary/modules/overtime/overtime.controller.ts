import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { BaseController } from "../../../../../core/crud-base/base-controller";
import { OvertimeSalary } from "./entities/overtime-salary.entity";
import { CreateOvertimeSalaryDto } from "./dto/create-overtime-salary.dto";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";
import { Types } from "mongoose";
import { UpdateOvertimeSalaryDto } from "./dto/update-overtime-salary.dto";
import { OvertimeService } from "./overtime.service";

@Controller("v1/salary/overtime")
export class OvertimeController extends BaseController<OvertimeSalary> {
  constructor(private readonly service: OvertimeService) {
    super(service);
  }

  @Post()
  async create(
    @Body() body: CreateOvertimeSalaryDto,
    ...args
  ): Promise<OvertimeSalary> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findById(id: any, ...args): Promise<OvertimeSalary> {
    return await super.findById(id, ...args);
  }

  @Get()
  async findAll(
    @Query("page") page: number,
    @Query("limit") limit: number,
    ...args
  ): Promise<CorePaginateResult<OvertimeSalary>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(
    @Body() updates: UpdateOvertimeSalaryDto,
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<OvertimeSalary> {
    return super.update(updates, id, ...args);
  }

  @Delete(":id")
  async delete(@Param("id") id: Types.ObjectId, ...args): Promise<void> {
    return super.delete(id, ...args);
  }
}
