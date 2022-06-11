import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {CreatePayrollDto} from './dto/create-payroll.dto';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {ApiConstant} from "../../../common/constant";
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../core/guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {CreateManyPayrollDto} from "../../v1/payroll/dto/create-many-payroll.dto";
import {SearchPayrollDto} from "../../v1/payroll/dto/search-payroll.dto";

@Controller(ApiConstant.V2.PAYROLL)
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class PayrollController {
  constructor(
    private readonly payrollService: PayrollService,
  ) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  create(
    @ReqProfile() profile: ProfileEntity,
    @Body() body: CreatePayrollDto,
  ) {
    return this.payrollService.create(profile, body);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Post("/multiple/creation")
  createMany(
    @ReqProfile() profile: ProfileEntity,
    @Body() body: CreateManyPayrollDto,
  ) {
    return this.payrollService.createMany(profile, body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.payrollService.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get()
  findAll(
    @ReqProfile() profile: ProfileEntity,
    @Query() search: SearchPayrollDto
  ) {
    return this.payrollService.findAll(profile, search);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Patch(":id")
  update(@ReqProfile() profile: ProfileEntity, @Param("id") id: number, @Body() updatePayrollDto: UpdatePayrollDto) {
    return this.payrollService.update(profile, +id, updatePayrollDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Delete(":id")
  remove(@ReqProfile() profile: ProfileEntity, @Param("id") id: number) {
    return this.payrollService.remove(profile, +id);
  }
}
