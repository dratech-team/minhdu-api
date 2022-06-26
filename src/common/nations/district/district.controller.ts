import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {DistrictService} from './district.service';
import {CreateDistrictDto} from './dto/create-district.dto';
import {UpdateDistrictDto} from './dto/update-district.dto';
import {ApiConstant} from "../../constant";

@Controller(ApiConstant.V1.ORGCHART.DISTRICT)
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {
  }

  @Post()
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtService.create(createDistrictDto);
  }

  @Get()
  findAll(
    @Query("provinceId") provinceId: number
  ) {
    return this.districtService.findAll(+provinceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDistrictDto: UpdateDistrictDto) {
    return this.districtService.update(+id, updateDistrictDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.districtService.remove(+id);
  }
}
