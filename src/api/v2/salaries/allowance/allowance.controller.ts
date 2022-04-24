import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import {DeleteMultipleAllowanceDto} from "./dto/delete-multiple-allowance.dto";
import {JwtAuthGuard} from "../../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../../core/guard/role.guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/salary/allowance')
export class AllowanceController {
  constructor(private readonly allowanceService: AllowanceService) {}

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/creation")
  createMany(@Body() body: CreateAllowanceDto) {
    return this.allowanceService.createMany(body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN,RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get()
  findAll() {
    return this.allowanceService.findAll();
  }

  @Roles(RoleEnum.SUPPER_ADMIN,RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allowanceService.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/updation")
  updateMany(@Body() body: UpdateAllowanceDto) {
    return this.allowanceService.updateMany(body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("multiple/deletion")
  removeMany(@Body() body: DeleteMultipleAllowanceDto) {
    return this.allowanceService.removeMany(body);
  }
}
