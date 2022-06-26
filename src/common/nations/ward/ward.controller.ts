import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {WardService} from './ward.service';
import {CreateWardDto} from './dto/create-ward.dto';
import {UpdateWardDto} from './dto/update-ward.dto';
import {ApiConstant} from "../../constant";

@Controller(ApiConstant.V1.ORGCHART.WARD)
export class WardController {
  constructor(private readonly wardService: WardService) {
  }

  @Post()
  create(@Body() createWardDto: CreateWardDto) {
    return this.wardService.create(createWardDto);
  }

  @Get()
  findAll(
    @Query("districtId") districtId: number
  ) {
    return this.wardService.findAll(+districtId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWardDto: UpdateWardDto) {
    return this.wardService.update(+id, updateWardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wardService.remove(+id);
  }
}
