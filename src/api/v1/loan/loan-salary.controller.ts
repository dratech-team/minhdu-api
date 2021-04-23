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
import { BaseController } from "../../../core/crud-base/base-controller";
import { LoanSalaryEntity } from "./entities/loan-salary.schema";
import { LoanSalaryService } from "./loan-salary.service";
import { CreateLoanSalaryDto } from "./dto/create-loan-salary.dto";
import { Types } from "mongoose";
import { CorePaginateResult } from "../../../core/interfaces/pagination";
import { UpdateLoanSalaryDto } from "./dto/update-loan-salary.dto";

@Controller("v1/payroll/loan")
export class LoanSalaryController extends BaseController<LoanSalaryEntity> {
  constructor(private readonly service: LoanSalaryService) {
    super(service);
  }

  @Post()
  async create(
    @Body() body: CreateLoanSalaryDto,
    ...args
  ): Promise<LoanSalaryEntity> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findOne(
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<LoanSalaryEntity> {
    return super.findOne(id, ...args);
  }

  @Get()
  async findAll(
    @Param("page") page: number,
    @Query("limit") limit: number,
    ...args
  ): Promise<CorePaginateResult<LoanSalaryEntity>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(
    updates: UpdateLoanSalaryDto,
    id: Types.ObjectId,
    ...args
  ): Promise<LoanSalaryEntity> {
    return super.update(updates, id, ...args);
  }

  @Delete(":id")
  async remove(id: Types.ObjectId, ...args): Promise<void> {
    return super.remove(id, ...args);
  }
}
