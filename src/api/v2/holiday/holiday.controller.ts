import {Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards} from '@nestjs/common';
import {HolidayService} from './holiday.service';
import {CreateHolidayDto} from './dto/create-holiday.dto';
import {UpdateHolidayDto} from './dto/update-holiday.dto';
import {ParseDatetimePipe} from "../../../core/pipe/datetime.pipe";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {LoggerGuard} from "../../../core/guard/logger.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../common/entities/profile.entity";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/holiday')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Post()
  create(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidayService.create(createHolidayDto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get()
  findAll(
    @ReqProfile() profile: ProfileEntity,
    @Query("take") take: number,
    @Query("skip") skip: number,
    @Query("name") name: string,
    @Query("datetime", ParseDatetimePipe) datetime: any,
    @Query("rate", ParseDatetimePipe) rate: number,
    @Query("department") department: string,
  ) {
    return this.holidayService.findAll(+take, +skip, profile, {
      name,
      datetime,
      rate: +rate,
      department,
    });
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
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
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHolidayDto: UpdateHolidayDto) {
    return this.holidayService.update(+id, updateHolidayDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.holidayService.remove(+id);
  }
}
