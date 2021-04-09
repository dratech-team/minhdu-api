import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../../../core/guard/jwt-auth.guard";

@Controller("v1/user")
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
