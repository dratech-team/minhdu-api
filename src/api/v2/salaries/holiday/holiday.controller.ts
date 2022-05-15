import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import {HolidayService} from './holiday.service';
import {CreateHolidayDto} from './dto/create-holiday.dto';
import {UpdateHolidayDto} from './dto/update-holiday.dto';
import {ApiV2Constant} from "../../../../common/constant/api.constant";
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {CreateManyHolidayDto} from "./dto/create-many-holiday.dto";
import {UpdateManyHolidayDto} from "./dto/update-many-holiday.dto";
import {RemoveManyHolidayDto} from "./dto/remove-many-holiday.dto";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiV2Constant.SALARY.HOLIDAY)
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  create(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidayService.create(createHolidayDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/creation")
  createMany(@Body() createHolidayDto: CreateManyHolidayDto) {
    return this.holidayService.createMany(createHolidayDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get()
  findAll() {
    return this.holidayService.findAll();
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.holidayService.findOne(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHolidayDto: UpdateHolidayDto) {
    return this.holidayService.update(+id, updateHolidayDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/updation")
  updateMany(@Body() updateHolidayDto: UpdateManyHolidayDto) {
    return this.holidayService.updateMany(updateHolidayDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.holidayService.remove(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/deletion")
  removeMany(@Body() body: RemoveManyHolidayDto) {
    return this.holidayService.removeMany(body);
  }
}
