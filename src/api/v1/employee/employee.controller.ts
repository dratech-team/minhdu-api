import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from "@nestjs/common";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {EmployeeService} from "./employee.service";
import {PaginateResult, Types} from "mongoose";
import {EmployeeEntity} from "./entities/employee.entity";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {ObjectId} from "mongodb";

@Controller("v1/employee")
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {
  }

  @Post()
  async create(@Body() body: CreateEmployeeDto): Promise<EmployeeEntity> {
    return this.service.create(body);
  }

  @Get()
  async findAll(
    @Query("page", ParseIntPipe) page: number,
    @Query("limit", ParseIntPipe) limit: number,
  ): Promise<PaginateResult<EmployeeEntity>> {
    return this.service.findAll({page, limit});
  }

  @Put(":id")
  async updateUser(
    @Body() body: UpdateEmployeeDto,
    @Param("id") id: ObjectId,
  ): Promise<EmployeeEntity> {
    return this.service.update(id, body);
  }

  @Put(":id/salary/:salaryId")
  async updateSalary(
    @Body() body: UpdateEmployeeDto,
    @Param("id") id: ObjectId,
    @Param("salaryId") salaryId: ObjectId,
  ): Promise<EmployeeEntity> {
    return this.service.update(id, body, salaryId);
  }

  @Delete(":id")
  async remove(@Param("id") id: ObjectId): Promise<void> {
    return this.service.remove(id);
  }

  @Delete(":id/salary/:salaryId")
  async removeSalary(
    @Param("id") id: ObjectId,
    @Param("salaryId") salaryId: ObjectId
  ): Promise<void> {
    return this.service.remove(id, salaryId);
  }
}
