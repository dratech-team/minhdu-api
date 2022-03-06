import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {CategoryService} from './category.service';
import {CreateCategoryDto} from './dto/create-category.dto';
import {UpdateCategoryDto} from './dto/update-category.dto';
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../common/entities/profile.entity";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {
  }

  @Roles(RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Post()
  create(@ReqProfile() profile: ProfileEntity, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(profile, createCategoryDto);
  }

  @Roles(RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Get()
  findAll(@ReqProfile() profile: ProfileEntity) {
    return this.categoryService.findAll(profile);
  }

  @Roles(RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Roles(RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Roles(RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
