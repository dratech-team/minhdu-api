import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { SalaryBlockService } from './salary-block.service';
import { CreateSalaryBlockDto } from './dto/create-salary-block.dto';
import { UpdateSalaryBlockDto } from './dto/update-salary-block.dto';
import {JwtAuthGuard} from "../../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../../core/guard/role.guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/settings/salary-block')
export class SalaryBlockController {
  constructor(private readonly salaryBlockService: SalaryBlockService) {}

  @Roles(RoleEnum.SUPPER_ADMIN)
  @Post()
  create(@Body() createSalaryBlockDto: CreateSalaryBlockDto) {
    return this.salaryBlockService.create(createSalaryBlockDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN)
  @Get()
  findAll() {
    return this.salaryBlockService.findAll();
  }

  @Roles(RoleEnum.SUPPER_ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryBlockService.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalaryBlockDto: UpdateSalaryBlockDto) {
    return this.salaryBlockService.update(+id, updateSalaryBlockDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaryBlockService.remove(+id);
  }
}
