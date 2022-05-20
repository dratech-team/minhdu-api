import {Body, Controller, Get, Param, Patch, Post, Query, UseGuards} from "@nestjs/common";
import {ApiConstant} from "../../../common/constant";
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../core/guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {PayrollServicev2} from "./payroll.service.v2";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {CreateManyPayrollDto} from "./dto/create-many-payroll.dto";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";

@Controller(ApiConstant.V2.PAYROLL)
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class Payrollv3Controller {
  constructor(
    private readonly payrollServicev2: PayrollServicev2,
  ) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  create(
    @ReqProfile() profile: ProfileEntity,
    @Body() body: CreatePayrollDto,
  ) {
    return this.payrollServicev2.create(profile, body);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Post("/multiple/creation")
  createMany(
    @ReqProfile() profile: ProfileEntity,
    @Body() body: CreateManyPayrollDto,
  ) {
    return this.payrollServicev2.createMany(profile, body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.payrollServicev2.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get()
  findAll(
    @ReqProfile() profile: ProfileEntity,
    @Query() search: SearchPayrollDto
  ) {
    return this.payrollServicev2.findAll(profile, search);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Patch(":id")
  update(@ReqProfile() profile: ProfileEntity, @Param("id") id: number, @Body() updatePayrollDto: UpdatePayrollDto) {
    return this.payrollServicev2.update(profile, +id, updatePayrollDto);
  }
}
