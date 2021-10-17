import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {LoggerService} from './logger.service';
import {CreateLoggerDto} from './dto/create-logger.dto';
import {UpdateLoggerDto} from './dto/update-logger.dto';
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {
  }

  @Post()
  create(@Body() createLoggerDto: CreateLoggerDto) {
    return this.loggerService.create(createLoggerDto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Get()
  findAll(
    @ReqProfile() profile: ProfileEntity,
    @Query("take") take: number,
    @Query("skip") skip: number,
  ) {
    return this.loggerService.findAll(profile, +take, +skip);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loggerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoggerDto: UpdateLoggerDto) {
    return this.loggerService.update(+id, updateLoggerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loggerService.remove(+id);
  }
}
