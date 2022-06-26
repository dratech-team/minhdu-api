import {Body, Controller, Delete, Get, Ip, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignupCredentialDto} from './dto/signup-credential.dto';
import {SignInCredentialDto} from "./dto/signin-credential.dto";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {ApiKeyGuard, JwtAuthGuard, RolesGuard} from "../../../core/guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {UpdateAuthDto} from "./dto/update-auth.dto";
import {SearchAuthDto} from "./dto/search-auth.dto";
import {ApiConstant} from "../../../common/constant";

@UseGuards(ApiKeyGuard)
@Controller(ApiConstant.V1.AUTH)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Patch('/change-password')
  async changePassword(@ReqProfile() profile: ProfileEntity, @Body("password") password: string) {
    return this.service.changePassword(profile, password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Patch('/:id')
  async update(
    @Param("id") id: string,
    @Body() body: UpdateAuthDto
  ) {
    return this.service.update(+id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Get()
  findAll(@ReqProfile() profile: ProfileEntity, @Query() search: SearchAuthDto) {
    return this.service.findAll(profile, search);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Delete(":id")
  remove(@ReqProfile() profile: ProfileEntity, @Param("id") id: number) {
    return this.service.remove(profile, +id);
  }

}
