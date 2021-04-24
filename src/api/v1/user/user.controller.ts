import {Body, Controller, Delete, Get, Param, Post, Put, Request} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {BaseController} from "../../../core/crud-base/base-controller";
import {UserService} from "./user.service";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {Types} from "mongoose";
import {UserEntity} from "./entities/user.entity";
import {UpdateUserDto} from "./dto/update-user.dto";
import {ObjectId} from "mongodb";

@Controller("v1/user")
export class UserController extends BaseController<UserEntity> {
  constructor(private readonly service: UserService) {
    super(service);
  }

  // @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @Post()
  async create(@Body() body: CreateUserDto, ...args): Promise<UserEntity> {
    return super.create(body, ...args);
  }

  @Get()
  async findAll(
    page: number,
    limit: number,
    ...args
  ): Promise<CorePaginateResult<UserEntity>> {
    return super.findAll(page, limit, ...args);
  }

  @Put(":id")
  async updateUser(
    @Body() body: UpdateUserDto,
    @Param("id") id: Types.ObjectId,
  ): Promise<UserEntity> {
    return this.service.update(id, body);
  }

  @Put(":id/salary/:salaryId")
  async updateSalary(
    @Body() body: UpdateUserDto,
    @Param("id") id: Types.ObjectId,
    @Param("salaryId") salaryId: Types.ObjectId,
    ...args
  ): Promise<UserEntity> {
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
