import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {AbsentService} from './absent.service';
import {UpdateAbsentDto} from './dto/update-absent.dto';
import {RemoveManyAbsentDto} from "./dto/remove-many-absent.dto";
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {CreateManyAbsentDto} from "./dto/create-many-absent.dto";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/salary/absent')
export class AbsentController {
  constructor(private readonly absentService: AbsentService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  create(@Body() body: CreateManyAbsentDto) {
    return this.absentService.createMany(body);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/creation")
  createMany(@Body() body: CreateManyAbsentDto) {
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
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/updation")
  updateMany(@Body() updateAbsentDto: UpdateAbsentDto) {
    return this.absentService.updateMany(updateAbsentDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('multiple/deletion')
  removeMany(@Body() body: RemoveManyAbsentDto) {
    return this.absentService.removeMany(body);
  }
}
