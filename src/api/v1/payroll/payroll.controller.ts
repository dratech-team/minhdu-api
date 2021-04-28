import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {PayrollService} from "./payroll.service";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {PayrollEntity} from "./entities/payroll.entity";
import {ObjectId} from "mongodb";
import {PaginateResult} from "mongoose";

@Controller("v1/payroll")
export class PayrollController {
  constructor(private readonly service: PayrollService) {
  }

  @Post()
  create(@Body() createSalaryDto: CreatePayrollDto): Promise<PayrollEntity> {
    return this.service.create(createSalaryDto);
  }

  @Get(":employeeId/payroll/:id")
  async findOne(
    @Param(":employeeId") employeeId: ObjectId,
    @Param(":id") id: ObjectId
  ): Promise<PayrollEntity> {
    return this.service.findOne(employeeId, id);
  }

  @Get(":employeeId")
  async findAll(
    @Param("employeeId") employeeId: ObjectId
  ): Promise<PaginateResult<PayrollEntity>> {
    return this.service.findAll(employeeId);
  }
}
