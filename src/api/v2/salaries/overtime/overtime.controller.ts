import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {OvertimeService} from './overtime.service';
import {CreateMultipleOvertimeDto} from './dto/create-multiple-overtime.dto';
import {UpdateOvertimeDto} from './dto/update-overtime.dto';
import {ApiKeyGuard, JwtAuthGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {DeleteMultipleOvertimeDto} from "./dto/delete-multiple-overtime.dto";
import {UpdateMultipleOvertimeDto} from "./dto/update-multiple-overtime.dto";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/salary/overtime')
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  create(@Body() createOvertimeDto: CreateMultipleOvertimeDto) {
    return this.overtimeService.create(createOvertimeDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('multiple/creation')
  createMany(@Body() createOvertimeDto: CreateMultipleOvertimeDto) {
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
  updateMany(@Body() updateOvertimeDto: UpdateMultipleOvertimeDto) {
    return this.overtimeService.updateMany(updateOvertimeDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.overtimeService.remove(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('multiple/deletion')
  removeMany(@Body() body: DeleteMultipleOvertimeDto) {
    return this.overtimeService.removeMany(body);
  }
}
