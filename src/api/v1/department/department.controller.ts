import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {BaseController} from "../../../core/crud-base/base-controller";
import {DepartmentEntity} from "./entities/departmentSchema";
import {DepartmentService} from "./department.service";
import {CreateDepartmentDto} from "./dto/create-department.dto";
import {ObjectId} from "mongodb";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {UpdateDepartmentDto} from "./dto/update-department.dto";

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
  async findOne(@Param("id") id: ObjectId, ...args): Promise<DepartmentEntity> {
    return super.findOne(id, ...args);
  }

  @Get()
  async findAll(
    @Param("page") page: number,
    @Param("limit") limit: number,
    ...args
  ): Promise<CorePaginateResult<DepartmentEntity>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(
    @Body() updates: UpdateDepartmentDto,
    id: ObjectId,
    ...args
  ): Promise<DepartmentEntity> {
    return super.update(updates, id, ...args);
  }

  @Delete(":id")
  async remove(id: ObjectId, ...args): Promise<void> {
    return super.remove(id, ...args);
  }
}
