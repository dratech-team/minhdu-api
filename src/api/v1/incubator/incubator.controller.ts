import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {IncubatorService} from './incubator.service';
import {CreateIncubatorDto} from './dto/create-incubator.dto';
import {UpdateIncubatorDto} from './dto/update-incubator.dto';
import {SearchIncubatorDto} from "./dto/search-incubator.dto";
import {ApiConstant} from "../../../common/constant";

@Controller(ApiConstant.V1.INCUBATOR)
export class IncubatorController {
  constructor(private readonly incubatorService: IncubatorService) {
  }

  @Post()
  create(@Body() createIncubatorDto: CreateIncubatorDto) {
    return this.incubatorService.create(createIncubatorDto);
  }

  @Get()
  findAll(@Query() search: SearchIncubatorDto) {
    return this.incubatorService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incubatorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncubatorDto: UpdateIncubatorDto) {
    return this.incubatorService.update(+id, updateIncubatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incubatorService.remove(+id);
  }
}
