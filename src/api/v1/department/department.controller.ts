import {Body, Controller, Delete, Get, Param, Post, Put,} from "@nestjs/common";
import {BaseController} from "../../../core/crud-base/base-controller";
import {DepartmentEntity} from "./entities/department.entity";
import {DepartmentService} from "./department.service";
import {CreateDepartmentDto} from "./dto/create-department.dto";
import {ObjectId} from "mongodb";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {UpdateDepartmentDto} from "./dto/update-department.dto";
import {ApiOperation} from "@nestjs/swagger";

@Controller("v1/department")
export class DepartmentController extends BaseController<DepartmentEntity> {
  constructor(private readonly service: DepartmentService) {
    super(service);
  }

  @Post()
  async create(
    @Body() body: CreateDepartmentDto,
    ...args
  ): Promise<DepartmentEntity> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findById(@Param("id") id: ObjectId, ...args): Promise<DepartmentEntity> {
    return super.findById(id, ...args);
  }

  @Get()
  async findAll(
    @Param("page") page: number,
    @Param("limit") limit: number,
    ...args
  ): Promise<CorePaginateResult<DepartmentEntity>> {
    return super.findAll(page, limit, ...args);
  }

  @ApiOperation({
    summary: 'Update department',
    description: 'Update lại tên department or danh sách branch của department này, truyền list id branch'
  })
  @Put(":id")
  async update(
    @Body() updates: UpdateDepartmentDto,
    id: ObjectId,
    ...args
  ): Promise<DepartmentEntity> {
    return super.update(updates, id, ...args);
  }

  @ApiOperation({
    summary: 'Remove department',
    description: 'Xóa department theo id'
  })
  @Delete(":id")
  async removeDepartment(@Param("id") id: ObjectId): Promise<void> {
    return this.service.remove(id);
  }

  @ApiOperation({
    summary: 'Remove department (branch)',
    description: 'xóa 1 branch ra khỏi department'
  })
  @Delete(":id/branch/:branchId")
  async removeBranch(
    @Param("id") id: ObjectId,
    @Param("branchId") branchId: ObjectId
  ): Promise<void> {
    return this.service.remove(id, branchId);
  }


}
