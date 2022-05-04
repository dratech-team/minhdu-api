import {Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common';
import {AllowanceService} from './allowance.service';
import {UpdateAllowanceDto} from './dto/update-allowance.dto';
import {RemoveManyAllowanceDto} from "./dto/remove-many-allowance.dto";
import {ApiKeyGuard, JwtAuthGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {CreateManyAllowanceDto} from "./dto/create-many-allowance.dto";
import {ReqProfile} from "../../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../../common/entities/profile.entity";
import {SearchAllowanceDto} from "./dto/search-allowance.dto";
import {ApiV2Constant} from "../../../../common/constant/api.constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiV2Constant.SALARY.ALLOWANCE)
export class AllowanceController {
  constructor(private readonly allowanceService: AllowanceService) {
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/creation")
  createMany(@ReqProfile() profile: ProfileEntity, @Body() body: CreateManyAllowanceDto) {
    return this.allowanceService.createMany(profile, body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get('multiple')
  findAll(@ReqProfile() profile: ProfileEntity, @Query() search: SearchAllowanceDto) {
    return this.allowanceService.findAll(profile, search);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allowanceService.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/updation")
  updateMany(@Body() body: UpdateAllowanceDto) {
    return this.allowanceService.updateMany(body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/deletion")
  removeMany(@Body() body: RemoveManyAllowanceDto) {
    return this.allowanceService.removeMany(body);
  }
}
