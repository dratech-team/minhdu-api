import {Body, Controller, Delete, Get, Ip, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignupCredentialDto} from './dto/signup-credential.dto';
import {SignInCredentialDto} from "./dto/signin-credential.dto";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {Role, RoleEnum} from "@prisma/client";
import {UpdateAuthDto} from "./dto/update-auth.dto";
import {LoggerGuard} from "../../../core/guard/logger.guard";

@UseGuards(ApiKeyGuard)
@Controller('v2/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {
  }

  @Post('/signup')
  async register(@ReqProfile() profile: ProfileEntity, @Body() body: SignupCredentialDto) {
    return await this.service.register(profile, body);
  }

  @Post('/signin')
  async signIn(
    @Ip() ip: any,
    @Body() body: SignInCredentialDto
  ): Promise<{ token: string }> {
    return this.service.signIn(ip, body);
  }

  @UseGuards(LoggerGuard, JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Patch('/change-password')
  async changePassword(@ReqProfile() profile: ProfileEntity, @Body("password") password: string) {
    return this.service.changePassword(profile, password);
  }

  @UseGuards(LoggerGuard, JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Patch('/:id')
  async update(
    @Param("id") id: string,
    @Body() body: UpdateAuthDto
  ) {
    return this.service.update(+id, body);
  }

  @UseGuards(LoggerGuard, JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Get()
  findAll(@ReqProfile() profile: ProfileEntity) {
    return this.service.findAll(profile);
  }

  @UseGuards(LoggerGuard, JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Delete(":id")
  remove(@ReqProfile() profile: ProfileEntity, @Param("id") id: number) {
    return this.service.remove(profile, +id);
  }

}
