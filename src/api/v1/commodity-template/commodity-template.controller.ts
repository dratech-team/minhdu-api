import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommodityTemplateService } from './commodity-template.service';
import { CreateCommodityTemplateDto } from './dto/create-commodity-template.dto';
import { UpdateCommodityTemplateDto } from './dto/update-commodity-template.dto';

@Controller('v2/commodity-template')
export class CommodityTemplateController {
  constructor(private readonly commodityTemplateService: CommodityTemplateService) {}

  @Post()
  create(@Body() createCommodityTemplateDto: CreateCommodityTemplateDto) {
    return this.commodityTemplateService.create(createCommodityTemplateDto);
  }

  @Get()
  findAll() {
    return this.commodityTemplateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commodityTemplateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommodityTemplateDto: UpdateCommodityTemplateDto) {
    return this.commodityTemplateService.update(+id, updateCommodityTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commodityTemplateService.remove(+id);
  }
}
