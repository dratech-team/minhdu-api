import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {Salaryv2Service} from './salaryv2.service';
import {UpdateSalaryv2Dto} from './dto/update-salaryv2.dto';
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {ApiKeyGuard, JwtAuthGuard, RolesGuard} from "../../../../core/guard";
import {CreateManySalaryv2Dto} from "./dto/create-many-salaryv2.dto";
import {UpdateManySalaryv2Dto} from "./dto/update-many-salaryv2.dto";
import {RemoteManySalaryv2Dto} from "./dto/remote-many-salaryv2.dto";
import {ApiV2Constant} from "../../../../common/constant/api.constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiV2Constant.SALARY.SALARYV2)
export class Salaryv2Controller {
  constructor(private readonly salaryv2Service: Salaryv2Service) {
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("/multiple/creation")
  createMany(@Body() body: CreateManySalaryv2Dto) {
    return this.salaryv2Service.createMany(body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Get()
  findAll() {
    return this.salaryv2Service.findAll();
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryv2Service.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('/multiple/updation')
  updateMany(@Body() updateSalaryv2Dto: UpdateManySalaryv2Dto) {
    return this.salaryv2Service.updateMany(updateSalaryv2Dto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('multiple/deletion')
  removeMany(@Body() body: RemoteManySalaryv2Dto) {
    return this.salaryv2Service.removeMany(body);
  }
}
