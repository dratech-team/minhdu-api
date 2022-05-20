import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {DeductionService} from './deduction.service';
import {CreateManyDeductionDto, RemoveManyDeductionDto, UpdateDeductionDto} from './dto';
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {ApiConstant} from "../../../../common/constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiConstant.V1.SALARY.DEDUCTION)
export class DeductionController {
  constructor(private readonly deductionService: DeductionService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('/multiple/creation')
  create(@Body() createDeductionDto: CreateManyDeductionDto) {
    return this.deductionService.create(createDeductionDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get()
  findAll() {
    return this.deductionService.findAll();
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deductionService.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('/multiple/updation')
  update(@Body() body: UpdateDeductionDto) {
    return this.deductionService.updateMany(body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('/multiple/deletion')
  remove(@Body() body: RemoveManyDeductionDto) {
    return this.deductionService.removeMany(body);
  }
}
