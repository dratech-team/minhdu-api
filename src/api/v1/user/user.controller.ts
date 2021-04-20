import {Body, Controller, Delete, Get, Param, Post, Put, Request} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {BaseController} from "../../../core/crud-base/base-controller";
import {UserService} from "./user.service";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {Types} from "mongoose";
import {UserEntity} from "./entities/user.entity";

@Controller("v1/user")
export class UserController extends BaseController<UserEntity> {
  constructor(userService: UserService) {
    super(userService);
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
  async update(
    @Body() body: CreateUserDto,
    @Param("id") id: Types.ObjectId,
    ...args
  ): Promise<UserEntity> {
    return super.update(body, id, ...args);
  }

  @Delete(":id")
  async remove(@Param("id") id: Types.ObjectId, ...args): Promise<void> {
    return super.remove(id, ...args);
  }
}
