import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {CommodityService} from './commodity.service';
import {CreateCommodityDto} from './dto/create-commodity.dto';
import {UpdateCommodityDto} from './dto/update-commodity.dto';
import {ApiConstant} from "../../../common/constant";
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../core/guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {SearchCommodityDto} from "./dto/search-commodity.dto";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiConstant.V1.COMMODITY)
export class CommodityController {
  constructor(private readonly commodityService: CommodityService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Post()
  create(@Body() body: CreateCommodityDto) {
    return this.commodityService.create(body);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Get()
  findAll(
    @Query() search: SearchCommodityDto
  ) {
    return this.commodityService.findAll(search);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commodityService.findFirst(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommodityDto: UpdateCommodityDto) {
    return this.commodityService.update(+id, updateCommodityDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commodityService.remove(+id);
  }
}
