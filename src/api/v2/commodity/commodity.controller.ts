import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {CommodityService} from './commodity.service';
import {CreateCommodityDto} from './dto/create-commodity.dto';
import {UpdateCommodityDto} from './dto/update-commodity.dto';

@Controller('v2/commodity')
export class CommodityController {
  constructor(private readonly commodityService: CommodityService) {
  }

  @Post()
  create(@Body() body: CreateCommodityDto) {
    return this.commodityService.create(body);
  }

  @Get()
  findAll(
    @Query("take") take: number,
    @Query("skip") skip: number,
  ) {
    return this.commodityService.findAll(+take, +skip);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commodityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommodityDto: UpdateCommodityDto) {
    return this.commodityService.update(+id, updateCommodityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commodityService.remove(+id);
  }
}
