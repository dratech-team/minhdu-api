import {Body, Controller, Get, Ip, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignupCredentialDto} from './dto/signup-credential.dto';
import {SignInCredentialDto} from "./dto/signin-credential.dto";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {Role} from "@prisma/client";
import {IsEnum} from "class-validator";
import {UpdateAuthDto} from "./dto/update-auth.dto";

@Controller('v2/auth')
@UseGuards(ApiKeyGuard)
export class AuthController {
  constructor(private readonly service: AuthService) {
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HUMAN_RESOURCE)
  @Post('/signup')
  async register(@ReqProfile() profile: ProfileEntity, @Body() body: SignupCredentialDto): Promise<{ status: string }> {
    return await this.service.register(profile, body);
  }

  @Post('/signin')
  async signIn(
    @Ip() ip: any,
    @Body() body: SignInCredentialDto
  ): Promise<{ token: string }> {
    return this.service.signIn(ip, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/change-password')
  async changePassword(@Param("id") id: string, @Body("password") password: string) {
    return this.service.changePassword(+id, password);
  }

  @Patch('/:id')
  async update(
    @Param("id") id: string,
    @Body() body: UpdateAuthDto
  ) {
    return this.service.update(+id, body);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HUMAN_RESOURCE)
  @Get()
  findAll(@ReqProfile() profile: ProfileEntity) {
    return this.service.findAll(profile);
  }
}
