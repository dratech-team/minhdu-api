import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {Salaryv2Service} from './salaryv2.service';
import {CreateSalaryv2Dto} from './dto/create-salaryv2.dto';
import {UpdateSalaryv2Dto} from './dto/update-salaryv2.dto';
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {JwtAuthGuard} from "../../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../../core/guard/role.guard";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/salaryv2')
export class Salaryv2Controller {
  constructor(private readonly salaryv2Service: Salaryv2Service) {
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("/multiple/creation")
  createMany(@Body() body: CreateSalaryv2Dto) {
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
  updateMany(@Body() updateSalaryv2Dto: UpdateSalaryv2Dto) {
    return this.salaryv2Service.updateMany(updateSalaryv2Dto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('multiple/deletion')
  removeMany(@Body('salaryIds') salaryIds: number[]) {
    return this.salaryv2Service.removeMany(salaryIds);
  }
}
