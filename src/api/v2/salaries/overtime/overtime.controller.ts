import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {OvertimeService} from './overtime.service';
import {CreateManyOvertimeDto} from './dto/create-many-overtime.dto';
import {UpdateOvertimeDto} from './dto/update-overtime.dto';
import {ApiKeyGuard, JwtAuthGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {RemoveManyOvertimeDto} from "./dto/remove-many-overtime.dto";
import {UpdateManyOvertimeDto} from "./dto/update-many-overtime.dto";
import {ApiV2Constant} from "../../../../common/constant/api.constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiV2Constant.SALARY.OVERTIME)
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  create(@Body() createOvertimeDto: CreateManyOvertimeDto) {
    return this.overtimeService.create(createOvertimeDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('multiple/creation')
  createMany(@Body() createOvertimeDto: CreateManyOvertimeDto) {
    return this.overtimeService.createMany(createOvertimeDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get('multiple')
  findAll() {
    return this.overtimeService.findAll();
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.overtimeService.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOvertimeDto: UpdateOvertimeDto) {
    return this.overtimeService.update(+id, updateOvertimeDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('multiple/updation')
  updateMany(@Body() updateOvertimeDto: UpdateManyOvertimeDto) {
    return this.overtimeService.updateMany(updateOvertimeDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.overtimeService.remove(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('multiple/deletion')
  removeMany(@Body() body: RemoveManyOvertimeDto) {
    return this.overtimeService.removeMany(body);
  }
}
