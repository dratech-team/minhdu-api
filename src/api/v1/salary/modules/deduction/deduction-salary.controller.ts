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
import { DeductionService } from "./deduction-salary.service";
import { CreateDeductionSalaryDto } from "./dto/create-deduction-salary.dto";
import { DeductionSalary } from "./entities/deduction-salary.entity";
import { Types } from "mongoose";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";
import { UpdateDeductionSalaryDto } from "./dto/update-deduction-salary.dto";

@Controller("v1/salary/deduction")
export class DeductionSalaryController extends BaseController<DeductionSalary> {
  constructor(private readonly service: DeductionService) {
    super(service);
  }

  @Post()
  async create(
    @Body() body: CreateDeductionSalaryDto,
    ...args
  ): Promise<DeductionSalary> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findById(
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<DeductionSalary> {
    return super.findById(id, ...args);
  }

  @Get()
  async findAll(
    @Param("page") page: number,
    @Param("limit") limit: number,
    ...args
  ): Promise<CorePaginateResult<DeductionSalary>> {
    return super.findAll(page, limit, ...args);
  }

  @Put()
  async update(
    @Body() updates: UpdateDeductionSalaryDto,
    id: Types.ObjectId,
    ...args
  ): Promise<DeductionSalary> {
    return super.update(updates, id, ...args);
  }

  @Delete("id")
  async delete(@Param("id") id: Types.ObjectId, ...args): Promise<void> {
    return super.delete(id, ...args);
  }
}
