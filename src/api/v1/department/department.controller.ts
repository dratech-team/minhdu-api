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
import {Department} from "./entities/department.entity";
import {DepartmentService} from "./department.service";
import {CreateDepartmentDto} from "./dto/create-department.dto";
import {ObjectId} from "mongodb";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {UpdateDepartmentDto} from "./dto/update-department.dto";

@Controller("v1/department")
export class DepartmentController extends BaseController<Department> {
  constructor(private readonly service: DepartmentService) {
    super(service);
  }

  @Post()
  async create(
    @Body() body: CreateDepartmentDto,
    ...args
  ): Promise<Department> {
    return super.create(body, ...args);
  }

  @Get(":id")
  async findById(@Param("id") id: ObjectId, ...args): Promise<Department> {
    return super.findById(id, ...args);
  }

  @Get()
  async findAll(
    @Param("page") page: number,
    @Param("limit") limit: number,
    ...args
  ): Promise<CorePaginateResult<Department>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async update(
    @Body() updates: UpdateDepartmentDto,
    id: ObjectId,
    ...args
  ): Promise<Department> {
    return super.update(updates, id, ...args);
  }

  @Delete(":id")
  async delete(id: ObjectId, ...args): Promise<void> {
    return super.delete(id, ...args);
  }
}
