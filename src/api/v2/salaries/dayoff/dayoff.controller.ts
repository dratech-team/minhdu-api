import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {DayoffService} from './dayoff.service';
import {CreateDayoffDto} from './dto/create-dayoff.dto';
import {UpdateDayoffDto} from './dto/update-dayoff.dto';
import {ApiV2Constant} from "../../../../common/constant/api.constant";
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {CreateManyDayoffDto} from "./dto/create-many-dayoff.dto";
import {UpdateManyDayoffDto} from "./dto/update-many-dayoff.dto";
import {RemoveManyDayoffDto} from "./dto/remove-many-dayoff.dto";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiV2Constant.SALARY.DAYOFF)
export class DayoffController {
  constructor(private readonly dayoffService: DayoffService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  create(@Body() createDayoffDto: CreateDayoffDto) {
    return this.dayoffService.create(createDayoffDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/creation")
  createMany(@Body() body: CreateManyDayoffDto) {
    return this.dayoffService.createMany(body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get()
  findAll() {
    return this.dayoffService.findAll();
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dayoffService.findOne(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDayoffDto: UpdateDayoffDto) {
    return this.dayoffService.update(+id, updateDayoffDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/updation")
  updateMany(@Body() body: UpdateManyDayoffDto) {
    return this.dayoffService.updateMany(body);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dayoffService.remove(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/deletion")
  removeMany(@Body() body: RemoveManyDayoffDto) {
    return this.dayoffService.removeMany(body);
  }
}
