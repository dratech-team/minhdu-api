import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {AbsentService} from './absent.service';
import {CreateAbsentDto} from './dto/create-absent.dto';
import {UpdateAbsentDto} from './dto/update-absent.dto';
import {DeleteMultipleAbsentDto} from "./dto/delete-multiple-absent.dto";
import {JwtAuthGuard} from "../../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../../core/guard/role.guard";
import {LoggerGuard} from "../../../../core/guard/logger.guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/salary/absent')
export class AbsentController {
  constructor(private readonly absentService: AbsentService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("/multiple/creation")
  createMany(@Body() body: CreateAbsentDto) {
    return this.absentService.createMany(body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get('/a')
  findAll() {
    return this.absentService.findAll();
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.absentService.findOne(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("/multiple/updation")
  updateMany(@Body() updateAbsentDto: UpdateAbsentDto) {
    return this.absentService.updateMany(updateAbsentDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('multiple/deletion')
  removeMany(@Body() body: DeleteMultipleAbsentDto) {
    return this.absentService.removeMany(body);
  }
}
