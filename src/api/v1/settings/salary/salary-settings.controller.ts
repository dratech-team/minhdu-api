import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {CreateSalarySettingsDto} from './dto/create-salary-settings.dto';
import {UpdateSalarySettingsDto} from './dto/update-salary-settings.dto';
import {SalarySettingsService} from "./salary-settings.service";
import {ApiKeyGuard, JwtAuthGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {ReqProfile} from "../../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../../common/entities/profile.entity";
import {SearchSalarySettingsDto} from "./dto/search-salary-settings.dto";
import {ApiConstant} from "../../../../common/constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiConstant.V1.SETTINGS.SALARY)
export class SalarySettingsController {
  constructor(private readonly salaryService: SalarySettingsService) {
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Post()
  create(@Body() body: CreateSalarySettingsDto) {
    return this.salaryService.create(body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Get()
  findAll(
    @ReqProfile() profile: ProfileEntity,
    @Query() search: SearchSalarySettingsDto
  ) {
    return this.salaryService.findAll(profile, search);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryService.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updates: UpdateSalarySettingsDto) {
    return this.salaryService.update(+id, updates);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaryService.remove(+id);
  }
}
