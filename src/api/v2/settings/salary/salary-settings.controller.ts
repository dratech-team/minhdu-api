import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {CreateSalarySettingsDto} from './dto/create-salary-settings.dto';
import {UpdateSalarySettingsDto} from './dto/update-salary-settings.dto';
import {SalarySettingsService} from "./salary-settings.service";
import {JwtAuthGuard} from "../../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../../core/guard/role.guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {ReqProfile} from "../../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../../common/entities/profile.entity";
import {SearchSalarySettingsDto} from "./dto/search-salary-settings.dto";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/settings/salary')
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

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Post('/migrate')
  migrate() {
    return this.salaryService.migrate();
  }
}
