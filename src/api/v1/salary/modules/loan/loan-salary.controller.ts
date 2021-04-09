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
import { LoanSalary } from "./schema/loan-salary.schema";
import { LoanSalaryService } from "./loan-salary.service";
import { CreateLoanSalaryDto } from "./dto/create-loan-salary.dto";
import { Types } from "mongoose";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";
import { UpdateLoanSalaryDto } from "./dto/update-loan-salary.dto";

@Controller("v1/salary/loan")
export class LoanSalaryController extends BaseController<LoanSalary> {
  constructor(private readonly service: LoanSalaryService) {
    super(service);
  }

  @Post()
  async create(
    @Body() body: CreateLoanSalaryDto,
    ...args
  ): Promise<LoanSalary> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findById(
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<LoanSalary> {
    return super.findById(id, ...args);
  }

  @Get()
  async findAll(
    @Param("page") page: number,
    @Query("limit") limit: number,
    ...args
  ): Promise<CorePaginateResult<LoanSalary>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(
    updates: UpdateLoanSalaryDto,
    id: Types.ObjectId,
    ...args
  ): Promise<LoanSalary> {
    return super.update(updates, id, ...args);
  }

  @Delete(":id")
  async delete(id: Types.ObjectId, ...args): Promise<void> {
    return super.delete(id, ...args);
  }
}
