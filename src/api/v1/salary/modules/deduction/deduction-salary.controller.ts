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
import { DeductionSalaryEntity } from "./entities/deduction-salary.schema";
import { Types } from "mongoose";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";
import { UpdateDeductionSalaryDto } from "./dto/update-deduction-salary.dto";

@Controller("v1/salary/deduction")
export class DeductionSalaryController extends BaseController<DeductionSalaryEntity> {
  constructor(private readonly service: DeductionService) {
    super(service);
  }

  @Post()
  async create(
    @Body() body: CreateDeductionSalaryDto,
    ...args
  ): Promise<DeductionSalaryEntity> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findOne(
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<DeductionSalaryEntity> {
    return super.findOne(id, ...args);
  }

  @Get()
  async findAll(
    @Param("page") page: number,
    @Param("limit") limit: number,
    ...args
  ): Promise<CorePaginateResult<DeductionSalaryEntity>> {
    return super.findAll(page, limit, ...args);
  }

  @Put()
  async update(
    @Body() updates: UpdateDeductionSalaryDto,
    id: Types.ObjectId,
    ...args
  ): Promise<DeductionSalaryEntity> {
    return super.update(updates, id, ...args);
  }

  @Delete("id")
  async remove(@Param("id") id: Types.ObjectId, ...args): Promise<void> {
    return super.remove(id, ...args);
  }
}
