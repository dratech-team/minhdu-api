import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {SalaryService} from './salary.service';
import {UpdateSalaryDto} from './dto/update-salary.dto';
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {ApiKeyGuard, JwtAuthGuard, RolesGuard} from "../../../../core/guard";
import {CreateManySalaryDto} from "./dto/create-many-salary.dto";
import {UpdateManySalaryDto} from "./dto/update-many-salary.dto";
import {RemoteManySalaryDto} from "./dto/remote-many-salary.dto";
import {ApiConstant} from "../../../../common/constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiConstant.V1.SALARY.SALARYV2)
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("/multiple/creation")
  createMany(@Body() body: CreateManySalaryDto) {
    return this.salaryService.createMany(body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Get()
  findAll() {
    return this.salaryService.findAll();
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryService.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('/multiple/updation')
  updateMany(@Body() updateSalaryv2Dto: UpdateManySalaryDto) {
    return this.salaryService.updateMany(updateSalaryv2Dto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('multiple/deletion')
  removeMany(@Body() body: RemoteManySalaryDto) {
    return this.salaryService.removeMany(body);
  }
}
