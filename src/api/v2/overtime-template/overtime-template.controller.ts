import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,} from "@nestjs/common";
import {OvertimeTemplateService} from "./overtime-template.service";
import {CreateOvertimeTemplateDto} from "./dto/create-overtime-template.dto";
import {UpdateOvertimeTemplateDto} from "./dto/update-overtime-template.dto";
import {ApiV2Constant} from "../../../common/constant/api.constant";
import {DatetimeUnit, RoleEnum} from "@prisma/client";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {LoggerGuard} from "../../../core/guard/logger.guard";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiV2Constant.OVERTIME_TEMPLATE)
export class OvertimeTemplateController {
  constructor(private readonly service: OvertimeTemplateService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Post()
  async create(@Body() body: CreateOvertimeTemplateDto) {
    return await this.service.create(body);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get()
  findAll(
    @ReqProfile() profile: ProfileEntity,
    @Query("take") take: number,
    @Query("skip") skip: number,
    @Query("title") title: string,
    @Query("price") price: number,
    @Query("unit") unit: DatetimeUnit,
    @Query("positionIds") positionIds: number[]
  ) {
    return this.service.findAll(+take, +skip, profile, {
      title,
      price: +price,
      unit,
      positionIds,
    });
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updates: UpdateOvertimeTemplateDto) {
    return this.service.update(+id, updates);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.service.remove(+id);
  }
}
