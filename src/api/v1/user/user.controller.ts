import {Controller, Get, UseGuards, Request, Post, Body} from "@nestjs/common";
import { JwtAuthGuard } from "../../../core/guard/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import {User} from "./schema/user.schema";
import {BaseController} from "../../../core/crud-base/base-controller";
import {UserService} from "./user.service";

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
        try {

            return super.create(body, ...args);
        } catch (e) {
            console.log(e);
        }
    }
}
