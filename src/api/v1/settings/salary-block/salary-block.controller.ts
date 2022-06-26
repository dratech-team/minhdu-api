import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {SalaryBlockService} from './salary-block.service';
import {CreateSalaryBlockDto} from './dto/create-salary-block.dto';
import {UpdateSalaryBlockDto} from './dto/update-salary-block.dto';
import {ApiKeyGuard, JwtAuthGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {ApiConstant} from "../../../../common/constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiConstant.V1.SETTINGS.BLOCK_SALARY)
export class SalaryBlockController {
  constructor(private readonly salaryBlockService: SalaryBlockService) {
  }

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
