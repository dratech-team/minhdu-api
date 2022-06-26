import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {BranchService} from './branch.service';
import {CreateBranchDto} from './dto/create-branch.dto';
import {UpdateBranchDto} from './dto/update-branch.dto';
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../core/guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../entities/profile.entity";
import {SearchBranchDto} from "./dto/search-branch.dto";
import {ApiConstant} from "../../constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiConstant.V1.ORGCHART.BRANCH)
export class BranchController {
  constructor(private readonly branchService: BranchService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.WAREHOUSE)
  @Post()
  create(@ReqProfile() profile: ProfileEntity, @Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(profile, createBranchDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.WAREHOUSE, RoleEnum.CAMP_ACCOUNTING, RoleEnum.SALESMAN)
  @Get()
  findAll(@ReqProfile() profile: ProfileEntity, @Param() search: SearchBranchDto) {
    return this.branchService.findAll(profile, search);
  }


  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.WAREHOUSE, RoleEnum.CAMP_ACCOUNTING)
  @Get(':id')
  async findOne(@ReqProfile() profile: ProfileEntity, @Param('id') id: number) {
    return this.branchService.findOne(profile, +id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.WAREHOUSE, RoleEnum.CAMP_ACCOUNTING)
  @Patch(':id')
  update(@ReqProfile() profile: ProfileEntity, @Param('id') id: number, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(profile, +id, updateBranchDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.WAREHOUSE)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.branchService.remove(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.WAREHOUSE, RoleEnum.CAMP_ACCOUNTING)
  @Delete('/allowance/:id')
  removeAlowance(@Param('id') id: number) {
    return this.branchService.removeAllowance(+id);
  }
}
