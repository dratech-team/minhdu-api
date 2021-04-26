import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserService} from "./user.service";
import {PaginateResult, Types} from "mongoose";
import {UserEntity} from "./entities/user.entity";
import {UpdateUserDto} from "./dto/update-user.dto";
import {ObjectId} from "mongodb";

@Controller("v1/user")
export class UserController {
  constructor(private readonly service: UserService) {
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<UserEntity> {
    return this.service.create(body);
  }

  @Get()
  async findAll(
    @Query("page", ParseIntPipe) page: number,
    @Query("limit", ParseIntPipe) limit: number,
  ): Promise<PaginateResult<UserEntity>> {
    return this.service.findAll({page, limit});
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
