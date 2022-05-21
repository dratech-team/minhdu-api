import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {HolidayService} from './holiday.service';
import {CreateHolidayDto} from './dto/create-holiday.dto';
import {UpdateHolidayDto} from './dto/update-holiday.dto';
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../core/guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {SearchHolidayDto} from "./dto/search-holiday.dto";
import {ApiConstant} from "../../../common/constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiConstant.V1.HOLIDAY)
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Post()
  create(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidayService.create(createHolidayDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get()
  findAll(
    @ReqProfile() profile: ProfileEntity,
    @Query() search: SearchHolidayDto,
  ) {
    return this.holidayService.findAll(profile, search);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('name') name: string,
    @Query('branch') branch: string,
    @Query('position') position: string,
  ) {
    return this.holidayService.findOne(+id, {name, branch, position});
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHolidayDto: UpdateHolidayDto) {
    return this.holidayService.update(+id, updateHolidayDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.holidayService.remove(+id);
  }
}
