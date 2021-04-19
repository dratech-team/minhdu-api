import {Controller, Get, UseGuards, Request, Post, Body} from "@nestjs/common";
import { JwtAuthGuard } from "../../../core/guard/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import {User} from "./schema/user.schema";
import {BaseController} from "../../../core/crud-base/base-controller";
import {UserService} from "./user.service";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {BasicSalary} from "../salary/modules/basic/schema/basic-salary.schema";
import {UpdateBasicSalaryDto} from "../salary/modules/basic/dto/update-basic-salary.dto";
import {Types} from "mongoose";

@Controller("v1/user")
export class UserController extends BaseController<User> {
    constructor( userService: UserService) {
        super(userService);
    }

    // @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@Request() req) {
        return req.user;
    }

    @Post()
    async create(@Body() body: CreateUserDto, ...args): Promise<User> {
        return super.create(body, ...args);
    }

    @Get()
    async findAll(
        page: number,
        limit: number,
        ...args
    ): Promise<CorePaginateResult<User>> {
        return super.findAll(page, limit, ...args);
    }

    @Put(":id")
    async update(
        @Body() body: CreateUserDto,
        @Param("id") id: Types.ObjectId,
        ...args
    ): Promise<User> {
        return super.update(body, id, ...args);
    }

    @Delete(":id")
    async delete(@Param("id") id: Types.ObjectId, ...args): Promise<void> {
        return super.delete(id, ...args);
    }
}
