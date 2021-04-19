import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { AllowanceSalary } from "./entities/allowance-salary.schema";
import { CreateAllowanceSalaryDto } from "./dto/create-allowance-salary.dto";
import { Types } from "mongoose";
import { UpdateAllowanceSalaryDto } from "./dto/update-allowance-salary.dto";
import { AllowanceService } from "./allowance.service";
import { BaseController } from "../../../../../core/crud-base/base-controller";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";

@Controller("v1/salary/allowance")
export class AllowanceController extends BaseController<AllowanceSalary> {
  constructor(private readonly service: AllowanceService) {
    super(service);
  }

  @Post()
  async create(
    @Body() body: CreateAllowanceSalaryDto,
    ...args
  ): Promise<AllowanceSalary> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findById(
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<AllowanceSalary> {
    return super.findById(id, ...args);
  }

  @Get()
  async findAll(
    page: number,
    limit: number,
    ...args
  ): Promise<CorePaginateResult<AllowanceSalary>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(
    @Body() body: UpdateAllowanceSalaryDto,
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<AllowanceSalary> {
    return super.update(body, id, ...args);
  }

  @Delete(":id")
  async delete(@Param("id") id: Types.ObjectId, ...args): Promise<void> {
    return super.delete(id, ...args);
  }
}
