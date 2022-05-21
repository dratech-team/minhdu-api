import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ProvinceService} from './province.service';
import {CreateProvinceDto} from './dto/create-province.dto';
import {UpdateProvinceDto} from './dto/update-province.dto';
import {ApiConstant} from "../../constant";

@Controller(ApiConstant.V1.ORGCHART.PROVINCE)
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {
  }

  @Post()
  create(@Body() createProvinceDto: CreateProvinceDto) {
    return this.provinceService.create(createProvinceDto);
  }

  @Get()
  findAll() {
    return this.provinceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provinceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProvinceDto: UpdateProvinceDto) {
    return this.provinceService.update(+id, updateProvinceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.provinceService.remove(+id);
  }
}
