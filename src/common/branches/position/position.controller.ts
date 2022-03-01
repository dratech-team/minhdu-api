import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {PositionService} from './position.service';
import {CreatePositionDto} from './dto/create-position.dto';
import {UpdatePositionDto} from './dto/update-position.dto';
import {SearchPositionDto} from "./dto/search-position.dto";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {LoggerGuard} from "../../../core/guard/logger.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.WAREHOUSE, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionService.create(createPositionDto);
  }

  @Get()
  findAll(@Query() search: SearchPositionDto) {
    return this.positionService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionService.findOne(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.WAREHOUSE, RoleEnum.CAMP_ACCOUNTING)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
    return this.positionService.update(+id, updatePositionDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.WAREHOUSE, RoleEnum.CAMP_ACCOUNTING)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionService.remove(+id);
  }
}
