import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query,} from "@nestjs/common";
import {DepartmentEntity} from "./entities/department.entity";
import {DepartmentService} from "./department.service";
import {CreateDepartmentDto} from "./dto/create-department.dto";
import {ObjectId} from "mongodb";
import {UpdateDepartmentDto} from "./dto/update-department.dto";
import {PaginateResult} from "mongoose";

@Controller("v1/department")
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {
  }

  @Post()
  async create(
    @Body() body: CreateDepartmentDto,
  ): Promise<DepartmentEntity> {
    return this.service.create(body);
  }

  @Get(":id")
  async findById(@Param("id") id: ObjectId): Promise<DepartmentEntity> {
    return this.service.findById(id);
  }

  @Get()
  async findAll(
    @Query("page", ParseIntPipe) page: number,
    @Query("limit", ParseIntPipe) limit: number,
  ): Promise<PaginateResult<DepartmentEntity>> {
    return this.service.findAll({page, limit});
  }

  @Put(":id")
  async update(
    @Body() updates: UpdateDepartmentDto,
    id: ObjectId,
  ): Promise<DepartmentEntity> {
    return this.service.update(id, updates);
  }

  @Delete(":id")
  async removeDepartment(@Param("id") id: ObjectId): Promise<void> {
    return this.service.remove(id);
  }


  @Delete(":id/branch/:branchId")
  async removeBranch(
    @Param("id") id: ObjectId,
    @Param("branchId") branchId: ObjectId
  ): Promise<void> {
    return this.service.remove(id, branchId);
  }


}
